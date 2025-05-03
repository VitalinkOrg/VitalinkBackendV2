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
import { ProcedureBySpecialty } from "@index/entity/ProcedureBySpecialty";
import { Package } from "@index/entity/Package";
import { ReviewDetail } from "@index/entity/ReviewDetail";


export default class SupplierController extends GenericController {
    private availabilityRepository = new GenericRepository(Availability);
    private specialtyBySupplierRepository = new GenericRepository(SpecialtyBySupplier);
    private procedureBySpecialtyRepository = new GenericRepository(ProcedureBySpecialty);
    private packageRepository = new GenericRepository(Package);
    private reviewDetailRepository = new GenericRepository(ReviewDetail);
  
    constructor() {
      super(Supplier);
    }
  
    async getSuppliersMainDashboard(reqHandler: RequestHandler): Promise<any> {
      return this.getService().getAllService(reqHandler, async (jwtData, httpExec, page: number, size: number) => {
        try {
          const specialty_code = getUrlParam("specialty_code", reqHandler.getRequest()) || null;
          const procedure_code = getUrlParam("procedure_code", reqHandler.getRequest()) || null;
          const min_stars = Number(getUrlParam("min_stars", reqHandler.getRequest()) || 0);
          const province_filter = getUrlParam("province", reqHandler.getRequest())?.toLowerCase() || null;
          const min_price = Number(getUrlParam("min_price", reqHandler.getRequest()) || 0);
          const max_price = Number(getUrlParam("max_price", reqHandler.getRequest()) || Number.MAX_SAFE_INTEGER);
  
          const [suppliers, allSpecialties, allProcedures, allPackages, allReviews, allAvailabilities] = await Promise.all([
            this.getRepository().findAll(reqHandler.getLogicalDelete(), {
              where: { is_deleted: false },
            }, page, size),
            this.specialtyBySupplierRepository.findByOptions(false, true, {
                relations: ["supplier", "medical_specialty"]
              }),
            this.procedureBySpecialtyRepository.findByOptions(false, true, { relations: ["specialty", "procedure"] }),
            this.packageRepository.findByOptions(false, true, { relations: ["procedure", "product"] }),
            this.reviewDetailRepository.findByOptions(false, true, {
                relations: ["review", "review.appointment", "review.appointment.supplier"]
            }),
            this.availabilityRepository.findByOptions(false, true, {
                relations: ["location", "supplier"]
              })
          ]);


  
          if (!suppliers || suppliers.length === 0) {
            return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
          }

          
            const reviewsBySupplier = new Map<number, ReviewDetail[]>();
            allReviews.forEach((r: ReviewDetail) => {
            const supplierId = r.review?.appointment?.supplier?.id;
            if (!supplierId) return;
            if (!reviewsBySupplier.has(supplierId)) reviewsBySupplier.set(supplierId, []);
            reviewsBySupplier.get(supplierId)!.push(r);
            });
  
            const specialtiesBySupplier = new Map<number, SpecialtyBySupplier[]>();
            allSpecialties.forEach((s: SpecialtyBySupplier) => {
            if (!s.supplier || !s.supplier.id) return;
            if (!specialtiesBySupplier.has(s.supplier.id)) specialtiesBySupplier.set(s.supplier.id, []);
            specialtiesBySupplier.get(s.supplier.id)!.push(s);
            });

  
            const proceduresBySpecialty = new Map<number, ProcedureBySpecialty[]>();
            allProcedures.forEach((p: ProcedureBySpecialty) => {
              if (!p.specialty || !p.specialty.id) return;
              if (!proceduresBySpecialty.has(p.specialty.id)) proceduresBySpecialty.set(p.specialty.id, []);
              proceduresBySpecialty.get(p.specialty.id)!.push(p);
            });
            
  
            const packagesByProcedure = new Map<number, Package[]>();
            allPackages.forEach((p: Package) => {
              if (!p.procedure || !p.procedure.id) return;
              if (!packagesByProcedure.has(p.procedure.id)) packagesByProcedure.set(p.procedure.id, []);
              packagesByProcedure.get(p.procedure.id)!.push(p);
            });

            const availabilitiesBySupplier = new Map<number, Availability[]>();
            allAvailabilities.forEach((a: Availability) => {
              const supplierId = a.supplier?.id;
              if (!supplierId) return;
              if (!availabilitiesBySupplier.has(supplierId)) availabilitiesBySupplier.set(supplierId, []);
              availabilitiesBySupplier.get(supplierId)!.push(a);
            });
            
            
  
          const filteredSuppliers = (await Promise.all(suppliers.map(async supplier => {
            const shouldInclude = await this.addSupplierData(
              supplier,
              specialty_code,
              procedure_code,
              min_stars,
              province_filter,
              min_price,
              max_price,
              specialtiesBySupplier.get(supplier.id) || [],
              proceduresBySpecialty,
              packagesByProcedure,
              reviewsBySupplier,
              availabilitiesBySupplier 
            );
            return shouldInclude ? supplier : null;
          }))).filter(Boolean);
  
          return httpExec.successAction(
            (reqHandler.getAdapter() as SupplierDTO).entitiesToResponseMain(filteredSuppliers),
            ConstHTTPRequest.GET_ALL_SUCCESS
          );
  
        } catch (error: any) {
          return await httpExec.databaseError(error, null, reqHandler.getMethod(), this.getControllerName());
        }
      });
    }
  
    private async addSupplierData(supplier: any, specialty_code: string | null, procedure_code: string | null,
      minStars: number, provinceFilter: string | null, minPrice: number, maxPrice: number,
      specialties: SpecialtyBySupplier[], proceduresBySpecialty: Map<number, ProcedureBySpecialty[]>,
      packagesByProcedure: Map<number, Package[]>, reviewsBySupplier: Map<number, ReviewDetail[]>,  availabilitiesBySupplier: Map<number, Availability[]>): Promise<boolean> {
  
        const supplierAvailabilities = availabilitiesBySupplier.get(supplier.id) || [];

        const locations = supplierAvailabilities
        .map(a => a.location)
        .filter((loc, i, self) => loc && self.findIndex(l => l && l.id === loc.id) === i);

        if (provinceFilter && !locations.some(loc => loc && loc.province?.toLowerCase() === provinceFilter)) {
        return false;
        }
  
      //reviewsBySupplier
      const supplierReviews = reviewsBySupplier.get(supplier.id) || [];
      let supplierReview: { stars_average: number, quantity: number } | null = null;

      if (supplierReviews.length) {
        const total = supplierReviews.reduce((sum, r) => sum + r.stars_point, 0);
        supplierReview = {
          stars_average: Math.round(total / supplierReviews.length),
          quantity: supplierReviews.length
        };
      }
      
      if (minStars > 0 && (!supplierReview || supplierReview.stars_average < minStars)) {
        return false;
      }
  
      const services = this.buildSupplierServices(specialties, proceduresBySpecialty, packagesByProcedure, specialty_code, procedure_code, minPrice, maxPrice);
  
      const flatPrices = services.flatMap(s => s.procedures.flatMap((p: { packages: any[]; }) => p.packages.map(pkg => pkg.reference_price)));
      const hasValidPrice = flatPrices.some(price => price >= minPrice && price <= maxPrice);
      if ((minPrice > 0 || maxPrice < Number.MAX_SAFE_INTEGER) && !hasValidPrice) return false;
  
      if ((specialty_code || procedure_code) && services.length === 0) return false;
  
      supplier.search_procedure_name = procedure_code ? (services.find(s => s.procedures.find((p: { procedure: { code: string; }; }) => p.procedure.code === procedure_code))?.procedures.find((p: { procedure: { code: string; }; }) => p.procedure.code === procedure_code)?.procedure.name ?? "Procedimiento") : "Cita de Valoración";
      supplier.search_reference_price = procedure_code ? `${Math.min(...flatPrices)}` : "18000";
  
      supplier.stars_by_supplier = supplierReview?.stars_average ?? null;
      supplier.review_quantity_by_supplier = supplierReview?.quantity ?? null;
  
      const next = this.getNextAvailability(supplierAvailabilities);
      supplier.date_availability = next?.date_availability ?? null;
      supplier.hour_availability = next?.hour_availability ?? null;
      supplier.location_number = locations.length;
  
      return true;
    }
  
    private buildSupplierServices(specialties: SpecialtyBySupplier[], proceduresBySpecialty: Map<number, ProcedureBySpecialty[]>,
      packagesByProcedure: Map<number, Package[]>, specialty_code: string | null, procedure_code: string | null,
      minPrice: number, maxPrice: number): any[] {
  
      return specialties.filter(s => !specialty_code || s.medical_specialty.code === specialty_code).map(s => {
        const procedures = (proceduresBySpecialty.get(s.id) || []).filter(p => !procedure_code || p.procedure.code === procedure_code).map(p => {
          const packages = (packagesByProcedure.get(p.id) || []).filter(pkg => {
            const price = Number(pkg.product?.value1 || 0);
            return price >= minPrice && price <= maxPrice;
          }).map(pkg => 
            (
            
            {
            id: pkg.id,
            product: pkg.product,
            reference_price: Number( pkg.product?.value1 || 0),
            discount: Number(pkg.discount || 0),
            discounted_price: Math.round(Number(pkg.product?.value1) * (1 - Number(pkg.discount || 0) / 100)),
            services_offer: pkg.services_offer,
            is_king: pkg.is_king,
          }));
  
          return { id: p.id, procedure: p.procedure, packages };
        });
        return { id: s.id, medical_specialty: s.medical_specialty, procedures };
      }).filter(service => service.procedures.length > 0);
    }
  
    private getNextAvailability(availabilities: Availability[]): { date_availability: string, hour_availability: string } | null {
        const now = moment().tz("America/Costa_Rica");
        const minDate = now.clone().add(7, "days").startOf("day");
      
        const dayMap: Record<string, number> = {
          sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
          thursday: 4, friday: 5, saturday: 6
        };
      
        const proximas = availabilities
        .map(av => {
          const weekday = av.weekday?.toLowerCase();
          const targetDay = dayMap[weekday];
      
          if (targetDay === undefined) return null;
      
          let targetDate = minDate.clone().day(targetDay);
          if (targetDate.isBefore(minDate)) targetDate.add(7, 'days');
      
          const fromTime = moment(av.from_hour, "HH:mm");
          const fullDateTime = targetDate.clone().hour(fromTime.hour()).minute(fromTime.minute());
      
          return { ...av, fullDateTime };
        })
        .filter((x): x is Availability & { fullDateTime: moment.Moment } => x !== null)
        .sort((a, b) => a.fullDateTime.valueOf() - b.fullDateTime.valueOf());
      
      
        const next = proximas[0];
      
        return next ? {
          date_availability: next.fullDateTime.format("DD/MM/YYYY"),
          hour_availability: next.fullDateTime.format("HH:mm")
        } : null;
      }
      



      async getById(reqHandler: RequestHandler): Promise<any> {
        return this.getService().getByIdService(reqHandler, async (jwtData, httpExec, id) => {
          try {
            const supplier: any | null = await this.getRepository().findById(id, reqHandler.getLogicalDelete(), {
              relations: ["id_type", "medical_type"]
            });
      
            if (!supplier) {
              return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
            }
      
            // 📌 1. Reviews agrupadas
            const reviewDetails = await this.reviewDetailRepository.findByOptions(false, true, {
              where: {
                review: {
                  appointment: {
                    supplier: { id },
                    is_deleted: false
                  }
                }
              },
              relations: [
                "review",
                "review.appointment",
                "review.customer",
                "review_code"
              ]
            });
      
            const groupedReviews: any[] = [];
            const reviewCodeSummary: Record<string, { total: number; count: number; created_date: Date | null }> = {};
      
            reviewDetails.forEach((detail: { review: any; stars_point: number; review_code: { code: any; }; created_date: any; }) => {
              const rev = detail.review;
              const app = rev?.appointment;
              if (!app || app.is_deleted) return;
      
              // Agrupar comentarios por review.id
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
                  stars: []
                };
                groupedReviews.push(reviewItem);
              }
      
              reviewItem.stars.push(detail.stars_point);
      
              // Agrupación por review_code
              const code = detail.review_code?.code;
              if (code) {
                if (!reviewCodeSummary[code]) {
                  reviewCodeSummary[code] = { total: 0, count: 0, created_date: detail.created_date };
                }
                reviewCodeSummary[code].total += detail.stars_point;
                reviewCodeSummary[code].count += 1;
              }
            });
      
            groupedReviews.forEach(r => {
              const total = r.stars.reduce((a: number, b: number) => a + b, 0);
              r.stars_average = Math.round(total / r.stars.length);
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
            const availabilities = await this.availabilityRepository.findByOptions(false, true, {
                where: { supplier: { id } },
                relations: ["location"]
              });
              
              const now = moment().tz("America/Costa_Rica");
              const minDate = now.clone().add(7, "days").startOf("day");
              
              const dayMap: Record<string, number> = {
                sunday: 0,
                monday: 1,
                tuesday: 2,
                wednesday: 3,
                thursday: 4,
                friday: 5,
                saturday: 6,
              };
              
              const next = availabilities
                .map((av: { weekday: string; from_hour: moment.MomentInput; }) => {
                  const weekday = av.weekday?.toLowerCase();
                  const targetDay = dayMap[weekday];
              
                  if (targetDay === undefined) return null; // <- ignora si no es válido
              
                  let date = minDate.clone().day(targetDay);
              
                  if (date.isBefore(minDate)) date.add(7, "days");
              
                  const from = moment(av.from_hour, "HH:mm");
              
                  return {
                    ...av,
                    fullDate: date.clone().hour(from.hour()).minute(from.minute())
                  };
                })
                .filter(Boolean) // elimina nulls
                .sort((a: { fullDate: number; }, b: { fullDate: number; }) => a.fullDate.valueOf() - b.fullDate.valueOf())[0];
              
              const locations = availabilities
                .map((av: { location: any; }) => av.location)
                .filter((loc: { id: any; }, i: any, self: any[]) => loc && self.findIndex(l => l.id === loc.id) === i);
              
      
            // 📌 3. Servicios del proveedor
            const specialties = await this.specialtyBySupplierRepository.findByOptions(false, true, {
              where: { supplier: { id } },
              relations: ["medical_specialty"]
            });
      
            const services = [];
      
            for (const spec of specialties) {
              const procedures = await this.procedureBySpecialtyRepository.findByOptions(false, true, {
                where: { specialty: { id: spec.id } },
                relations: ["procedure"]
              });
      
              const formattedProcedures = [];
      
              for (const proc of procedures) {
                const packages = await this.packageRepository.findByOptions(false, true, {
                  where: { procedure: { id: proc.id } },
                  relations: ["product"]
                });
      
                formattedProcedures.push({
                  id: proc.id,
                  procedure: proc.procedure,
                  packages: packages.map((pkg: { reference_price: any; discount: any; id: any; product: any; services_offer: any; description: any; is_king: any; }) => {
                    const price = Number(pkg.reference_price);
                    const discount = Number(pkg.discount || 0);
                    return {
                      id: pkg.id,
                      product: pkg.product,
                      reference_price: price,
                      discount,
                      discounted_price: Math.round(price * (1 - discount / 100)),
                      services_offer: pkg.services_offer,
                      description: pkg.description,
                      is_king: pkg.is_king
                    };
                  })
                });
              }
      
              if (formattedProcedures.length > 0) {
                services.push({
                  id: spec.id,
                  medical_specialty: spec.medical_specialty,
                  procedures: formattedProcedures
                });
              }
            }
      
            // 📌 4. Agregar toda la info al objeto final
            supplier.reviews = groupedReviews;
            supplier.review_details_summary = reviewsSummary;
            supplier.availabilities = availabilities;
            supplier.locations = locations;
            supplier.location_number = locations.length;
            supplier.services = services;
            supplier.date_availability = next ? next.fullDate.format("DD/MM/YYYY") : null;
            supplier.hour_availability = next ? next.fullDate.format("HH:mm") : null;
      
            return httpExec.successAction(
              reqHandler.getAdapter().entityToResponse(supplier),
              ConstHTTPRequest.GET_BY_ID_SUCCESS
            );
      
          } catch (error: any) {
            return await httpExec.databaseError(error, jwtData.id.toString(), reqHandler.getMethod(), this.getControllerName());
          }
        });
      }
     
}
  