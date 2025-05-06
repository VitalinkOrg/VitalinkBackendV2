import { Availability } from "@index/entity/Availability";
import { Supplier } from "@index/entity/Supplier";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import SupplierDTO from "../dtos/SupplierDTO";
import { getUrlParam } from "@TenshiJS/utils/generalUtils";
import moment from "moment-timezone";
import "moment/locale/es";
import { SpecialtyBySupplier } from "@index/entity/SpecialtyBySupplier";
import { Package } from "@index/entity/Package";
import { ReviewDetail } from "@index/entity/ReviewDetail";
import { UnitDynamicCentral } from "@TenshiJS/entity/UnitDynamicCentral";
import { General } from "@index/consts/Const";


export default class SupplierController extends GenericController {
    private availabilityRepository = new GenericRepository(Availability);
    private specialtyBySupplierRepository = new GenericRepository(SpecialtyBySupplier);
    private packageRepository = new GenericRepository(Package);
    private reviewDetailRepository = new GenericRepository(ReviewDetail);
  
    constructor() {
      super(Supplier);
    }
  
    async getSuppliersMainDashboard(reqHandler: RequestHandler): Promise<any> {
      return this.getService().getAllService(reqHandler, async (jwtData, httpExec, page: number, size: number) => {
        try {
          const specialty_code   = getUrlParam("specialty_code", reqHandler.getRequest()) || null;
          const procedure_code   = getUrlParam("procedure_code", reqHandler.getRequest()) || null;
          const min_stars        = Number(getUrlParam("min_stars", reqHandler.getRequest()) || 0);
          const province_filter  = getUrlParam("province", reqHandler.getRequest())?.toLowerCase() || null;
          const min_price        = Number(getUrlParam("min_price", reqHandler.getRequest()) || 0);
          const max_price        = Number(getUrlParam("max_price", reqHandler.getRequest()) || Number.MAX_SAFE_INTEGER);
    
          const [suppliers, allSpecialties, allPackages, allReviews, allAvailabilities] = await Promise.all([
            this.getRepository().findAll(reqHandler.getLogicalDelete(), { where: { is_deleted: false } }, page, size),
            this.specialtyBySupplierRepository.findByOptions(false, true, { relations: ["supplier", "medical_specialty"] }),
            this.packageRepository.findByOptions(false, true, { relations: ["procedure", "product", "specialty"] }),
            this.reviewDetailRepository.findByOptions(false, true, { relations: ["review", "review.appointment", "review.appointment.supplier"] }),
            this.availabilityRepository.findByOptions(false, true, { relations: ["location", "supplier"] })
          ]);
    
          if (!suppliers || suppliers.length === 0) {
            return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
          }
    
          // Agrupar reseñas por proveedor
          const reviewsBySupplier = new Map<number, ReviewDetail[]>();
          allReviews.forEach((r: ReviewDetail) => {
            const supId = r.review?.appointment?.supplier?.id;
            if (!supId) return;
            if (!reviewsBySupplier.has(supId)) reviewsBySupplier.set(supId, []);
            reviewsBySupplier.get(supId)!.push(r);
          });
    
          // Agrupar especialidades por proveedor
          const specialtiesBySupplier = new Map<number, SpecialtyBySupplier[]>();
          allSpecialties.forEach((s: SpecialtyBySupplier) => {
            const supId = s.supplier?.id;
            if (!supId) return;
            if (!specialtiesBySupplier.has(supId)) specialtiesBySupplier.set(supId, []);
            specialtiesBySupplier.get(supId)!.push(s);
          });
    
          // Agrupar paquetes por ID de SpecialtyBySupplier
          const packagesBySpecialty = new Map<number, Package[]>();
          allPackages.forEach((p: Package) => {
            const specId = p.specialty?.id;
            if (!specId) return;
            if (!packagesBySpecialty.has(specId)) packagesBySpecialty.set(specId, []);
            packagesBySpecialty.get(specId)!.push(p);
          });
    
          // Agrupar disponibilidades por proveedor
          const availabilitiesBySupplier = new Map<number, Availability[]>();
          allAvailabilities.forEach((a: Availability) => {
            const supId = a.supplier?.id;
            if (!supId) return;
            if (!availabilitiesBySupplier.has(supId)) availabilitiesBySupplier.set(supId, []);
            availabilitiesBySupplier.get(supId)!.push(a);
          });
    
          // Filtrar y enriquecer cada proveedor
          const filtered = (await Promise.all(
            suppliers.map(async supplier => {
              const include = await this.addSupplierData(
                supplier,
                specialty_code,
                procedure_code,
                min_stars,
                province_filter,
                min_price,
                max_price,
                specialtiesBySupplier.get(supplier.id) || [],
                packagesBySpecialty,
                reviewsBySupplier,
                availabilitiesBySupplier
              );
              return include ? supplier : null;
            })
          )).filter(Boolean);
    
          return httpExec.successAction(
            (reqHandler.getAdapter() as SupplierDTO).entitiesToResponseMain(filtered),
            ConstHTTPRequest.GET_ALL_SUCCESS
          );
        } catch (error: any) {
          return await httpExec.databaseError(error, null, reqHandler.getMethod(), this.getControllerName());
        }
      });
    }
    
    private async addSupplierData(
      supplier: any,
      specialty_code: string | null,
      procedure_code: string | null,
      minStars: number,
      provinceFilter: string | null,
      minPrice: number,
      maxPrice: number,
      specialties: SpecialtyBySupplier[],
      packagesBySpecialty: Map<number, Package[]>,
      reviewsBySupplier: Map<number, ReviewDetail[]>,
      availabilitiesBySupplier: Map<number, Availability[]>
    ): Promise<boolean> {
    
      // Filtrar por provincia
      const supAv = availabilitiesBySupplier.get(supplier.id) || [];
      const locations = supAv
        .map(a => a.location)
        .filter((loc, i, arr) => loc && arr.findIndex(l => l?.id === loc.id) === i);
      if (provinceFilter && !locations.some(loc => loc && loc.province?.toLowerCase() === provinceFilter)) {
        return false;
      }
    
      // Calcular reseñas
      const supReviews = reviewsBySupplier.get(supplier.id) || [];
      let reviewSummary: { stars_average: number; quantity: number } | null = null;
      if (supReviews.length) {
        const total = supReviews.reduce((sum, r) => sum + r.stars_point, 0);
        reviewSummary = {
          stars_average: Math.round(total / supReviews.length),
          quantity: supReviews.length
        };
      }
      if (minStars > 0 && (!reviewSummary || reviewSummary.stars_average < minStars)) {
        return false;
      }
    
      // Construir servicios (procedimientos)
      const services = this.buildProceduresBySpecialty(
        specialties,
        packagesBySpecialty,
        specialty_code,
        procedure_code,
        minPrice,
        maxPrice
      );
    
      // LOG 3
      const flatPrices = services.flatMap(s =>
        s.procedures.flatMap(p => p.packages.map(pkg => pkg.reference_price))
      );
      const hasValidPrice = flatPrices.some(price => price >= minPrice && price <= maxPrice);
      if ((minPrice > 0 || maxPrice < Number.MAX_SAFE_INTEGER) && !hasValidPrice) {
        return false;
      }
    
      // Filtrar si no hay coincidencias de especialidad/procedimiento
      if ((specialty_code || procedure_code) && services.length === 0) {
        return false;
      }
    
      // Asignar datos al proveedor
      supplier.search_procedure_name = procedure_code
        ? (services
            .find(s => s.procedures.some(p => p.procedure.code === procedure_code))
            ?.procedures.find(p => p.procedure.code === procedure_code)?.procedure.name || "Procedimiento")
        : "Cita de Valoración";
      supplier.search_reference_price = procedure_code && flatPrices.length
        ? `${Math.min(...flatPrices)}`
        : General.minimumPriceAppointmentValorationReference.toString();
    
      supplier.stars_by_supplier = reviewSummary?.stars_average || null;
      supplier.review_quantity_by_supplier = reviewSummary?.quantity || null;
    
      const next = this.getNextAvailability(supAv);
      supplier.date_availability = next?.date_availability || null;
      supplier.hour_availability = next?.hour_availability || null;
      supplier.location_number = locations.length;
    
      supplier.services_names = services.map(s => s.medical_specialty.name);
      supplier.procedures     = services;
    
      return true;
    }
    
    /**
     * Construye el listado de procedimientos y sus paquetes por cada especialidad
     */
    private buildProceduresBySpecialty(
      specialties: SpecialtyBySupplier[],
      packagesBySpecialty: Map<number, Package[]>,
      specialty_code: string | null,
      procedure_code: string | null,
      minPrice: number,
      maxPrice: number
    ): Array<{
      id: number;
      medical_specialty: UnitDynamicCentral;
      procedures: Array<{ procedure: UnitDynamicCentral; packages: any[] }>;
    }> {
    
      return specialties
        .filter(s => {
          const keep = !specialty_code || s.medical_specialty.code === specialty_code;
          return keep;
        })
        .map(s => {
          const procMap = new Map<string, { procedure: UnitDynamicCentral; packages: any[] }>();
          const pkgs = packagesBySpecialty.get(s.id) || [];
    
          pkgs.forEach(pkg => {
            const code     = pkg.procedure?.code;
            const rawPrice = pkg.product?.value1;
            const price    = rawPrice ? Number(rawPrice) : 0;
    
            const procMatch = !procedure_code || code === procedure_code;
            const minMatch  = price >= minPrice;
            const maxMatch  = price <= maxPrice;
            if (!procMatch || !minMatch || !maxMatch) {
             
              return;
            }
    
            const discount        = Number(pkg.discount ?? 0);
            const discountedPrice = Math.round(price * (1 - discount / 100));
    
            const pkgData = {
              id: pkg.id,
              product: pkg.product,
              reference_price: price,
              discount,
              discounted_price: discountedPrice,
              services_offer: pkg.services_offer,
              is_king: pkg.is_king
            };
    
            if (!procMap.has(code)) {
              procMap.set(code, { procedure: pkg.procedure!, packages: [] });
            }
            procMap.get(code)!.packages.push(pkgData);
          });
    
          const procedures = Array.from(procMap.values());
    
          return { id: s.id, medical_specialty: s.medical_specialty, procedures };
        })
        .filter(item => {
          const has = item.procedures.length > 0;
          return has;
        });
    }
    
  
    private getNextAvailability(availabilities: Availability[]): { date_availability: string; hour_availability: string } | null {
      const now = moment().tz("America/Costa_Rica");
      const minDate = now.clone().add(7, "days").startOf("day");
      const dayMap: Record<string, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
      };
  
      const nexts = availabilities
        .map(av => {
          const wd = av.weekday?.toLowerCase();
          const target = dayMap[wd || ""];
          if (target === undefined) return null;
          let dt = minDate.clone().day(target);
          if (dt.isBefore(minDate)) dt.add(7, "days");
          const from = moment(av.from_hour, "HH:mm");
          return { fullDateTime: dt.hour(from.hour()).minute(from.minute()) };
        })
        .filter((x): x is { fullDateTime: moment.Moment } => x !== null)
        .sort((a, b) => a.fullDateTime.valueOf() - b.fullDateTime.valueOf());
  
      if (!nexts.length) return null;
      const first = nexts[0].fullDateTime;
      return { date_availability: first.format("DD/MM/YYYY"), hour_availability: first.format("HH:mm") };
    }
  


    async getById(reqHandler: RequestHandler): Promise<any> {
      return this.getService().getByIdService(reqHandler, async (jwtData, httpExec, id) => {
        try {
          // 1️⃣ Obtener el supplier principal
          const supplier: any | null = await this.getRepository().findById(
            id,
            reqHandler.getLogicalDelete(),
            { relations: ["id_type", "medical_type"] }
          );
          if (!supplier) {
            return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
          }
    
          // 📌 1. Reseñas agrupadas
          const reviewDetails = await this.reviewDetailRepository.findByOptions(
            false,
            true,
            {
              where: {
                review: {
                  appointment: {
                    supplier: { id },
                    is_deleted: false
                  }
                }
              },
              relations: ["review", "review.appointment", "review.customer", "review_code"]
            }
          );
    
          const groupedReviews: any[] = [];
          const reviewCodeSummary: Record<string, { total: number; count: number; created_date: Date | null }> = {};
    
          for (const detail of reviewDetails) {
            const rev = detail.review;
            const app = rev?.appointment;
            if (!app || app.is_deleted) continue;
    
            let reviewItem = groupedReviews.find(r => r.id === rev.id);
            if (!reviewItem) {
              reviewItem = {
                id: rev.id,
                customer: rev.customer?.id || null,
                comment: rev.comment,
                is_annonymous: rev.is_annonymous,
                supplier_reply: rev.supplier_reply,
                created_date: rev.created_date,
                updated_date: rev.updated_date,
                stars: [] as number[]
              };
              groupedReviews.push(reviewItem);
            }
            reviewItem.stars.push(detail.stars_point);
    
            const code = detail.review_code?.code;
            if (code) {
              if (!reviewCodeSummary[code]) {
                reviewCodeSummary[code] = { total: 0, count: 0, created_date: detail.created_date };
              }
              reviewCodeSummary[code].total += detail.stars_point;
              reviewCodeSummary[code].count += 1;
            }
          }
    
          // Calcular promedio por reseña
          groupedReviews.forEach(r => {
            const sum = r.stars.reduce((a: any, b: any) => a + b, 0);
            r.stars_average = Math.round(sum / r.stars.length);
            delete r.stars;
          });
    
          const reviewsSummary = Object.keys(reviewCodeSummary).map(code => {
            const data = reviewCodeSummary[code];
            return {
              review: code,
              stars_point_average: Math.round(data.total / data.count),
              created_date: data.created_date
            };
          });
    
          // 📌 2. Disponibilidades y ubicaciones
          const availabilities = await this.availabilityRepository.findByOptions(
            false,
            true,
            { where: { supplier: { id } }, relations: ["location"] }
          );
    
          const now = moment().tz("America/Costa_Rica");
          const minDate = now.clone().add(7, "days").startOf("day");
          const dayMap: Record<string, number> = {
            sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
            thursday: 4, friday: 5, saturday: 6
          };
    
          const next = availabilities
            .map((av: { weekday: string; from_hour: moment.MomentInput; }) => {
              const weekday = av.weekday?.toLowerCase();
              const targetDay = dayMap[weekday!];
              if (targetDay === undefined) return null;
              let date = minDate.clone().day(targetDay);
              if (date.isBefore(minDate)) date.add(7, "days");
              const from = moment(av.from_hour, "HH:mm");
              return { ...av, fullDate: date.clone().hour(from.hour()).minute(from.minute()) };
            })
            .filter((x: { fullDate: moment.Moment } | null): x is { fullDate: moment.Moment } => x !== null)
            .sort((a: { fullDate: number; }, b: { fullDate: number; }) => a.fullDate.valueOf() - b.fullDate.valueOf())[0] || null;
    
          const locations = availabilities
            .map((av: { location: any; }) => av.location)
            .filter((loc: { id: any; }, i: any, arr: any[]) => loc && arr.findIndex(l => l.id === loc.id) === i);
    
          // 📌 3. Servicios (ahora "procedures")
          // 3.1. Traer especialidades del supplier
          const specialties = await this.specialtyBySupplierRepository.findByOptions(
            false,
            true,
            {
              where: { supplier: { id } },
              relations: ["supplier", "medical_specialty"]
            }
          );
    
          // 3.2. Traer paquetes con su specialty-relación
          const allPackages = await this.packageRepository.findByOptions(
            false,
            true,
            {
              where: { specialty: { supplier: { id } } },
              relations: ["procedure", "product", "specialty"]
            }
          );
    
          // 3.3. Agrupar por specialty.id
          const packagesBySpecialty = new Map<number, Package[]>();
          for (const pkg of allPackages) {
            const sid = pkg.specialty?.id;
            if (!sid) continue;
            if (!packagesBySpecialty.has(sid)) packagesBySpecialty.set(sid, []);
            packagesBySpecialty.get(sid)!.push(pkg);
          }
    
          // 3.4. Construir el array de servicios/procedures
          const services = specialties
            .map((spec: { id: number; medical_specialty: any; }) => {
              const specialtyPackages = packagesBySpecialty.get(spec.id) || [];
              const procedureMap = new Map<string, { procedure: UnitDynamicCentral; packages: any[] }>();
    
              for (const pkg of specialtyPackages) {
                const procedureCode = pkg.procedure?.code;
                if (!procedureCode) continue;
    
                if (!procedureMap.has(procedureCode)) {
                  procedureMap.set(procedureCode, {
                    procedure: pkg.procedure!,
                    packages: []
                  });
                }
    
                const price = Number(pkg.product?.value1 || 0);
                const discount = Number(pkg.discount || 0);
                const discountedPrice = Math.round(price * (1 - discount / 100));
    
                procedureMap.get(procedureCode)!.packages.push({
                  id: pkg.id,
                  product: pkg.product,
                  reference_price: price,
                  discount,
                  discounted_price: discountedPrice,
                  services_offer: pkg.services_offer,
                  is_king: pkg.is_king,
                  observations: pkg.observations,
                  postoperative_assessments: pkg.postoperative_assessments
                });
              }
    
              const procedures = Array.from(procedureMap.values());
              return {
                id: spec.id,
                medical_specialty: spec.medical_specialty,
                procedures
              };
            })
            .filter((svc: { procedures: string | any[]; }) => svc.procedures.length > 0);
    
          // 📌 4. Armar el objeto final
          supplier.reviews                    = groupedReviews;
          supplier.review_details_summary    = reviewsSummary;
          supplier.availabilities             = availabilities;
          supplier.locations                  = locations;
          supplier.location_number            = locations.length;
          supplier.services                   = services;
          supplier.date_availability          = next ? next.fullDate.format("DD/MM/YYYY") : null;
          supplier.hour_availability          = next ? next.fullDate.format("HH:mm") : null;
    
          return httpExec.successAction(
            reqHandler.getAdapter().entityToResponse(supplier),
            ConstHTTPRequest.GET_BY_ID_SUCCESS
          );
        } catch (error: any) {
          return await httpExec.databaseError(
            error,
            jwtData.id.toString(),
            reqHandler.getMethod(),
            this.getControllerName()
          );
        }
      });
    }
    
}
  