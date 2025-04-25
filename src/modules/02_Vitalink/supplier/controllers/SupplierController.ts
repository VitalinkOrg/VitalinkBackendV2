import { Availability } from "@index/entity/Availability";
import { Supplier } from "@index/entity/Supplier";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import SupplierDTO from "../dtos/SupplierDTO";
import { getUrlParam } from "@TenshiJS/utils/generalUtils";
import moment, { min } from "moment-timezone";
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


                const suppliers = await this.getRepository().findAll(reqHandler.getLogicalDelete(), {
                    where: { is_deleted: false },
                    relations: ["id_type", "medical_type"]
                }, page, size);

                if (!suppliers || suppliers.length === 0) {
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

                
                const filteredSuppliers = [];
                for (const supplier of suppliers) {
                   
                    const shouldInclude = await this.addSupplierData(supplier, specialty_code, procedure_code, min_stars, province_filter, min_price, max_price);
                    if (shouldInclude) filteredSuppliers.push(supplier);
                }

                return httpExec.successAction(
                    (reqHandler.getAdapter() as SupplierDTO).entitiesToResponseMain(filteredSuppliers),
                    ConstHTTPRequest.GET_ALL_SUCCESS
                );

            } catch (error: any) {
                return await httpExec.databaseError(error, null, reqHandler.getMethod(), this.getControllerName());
            }
        });
    }





    private async addSupplierData(  supplier: any, 
                                    specialty_code: string | null, 
                                    procedure_code: string | null, 
                                    minStars: number,  
                                    provinceFilter: string | null,
                                    minPrice: number,
                                    maxPrice: number
                                ): Promise<boolean> {
        const availabilities = await this.availabilityRepository.findByOptions(false, true, {
            where: { supplier: { id: supplier.id } },
            relations: ["location"]
        });

        const nextAvailability = this.getNextAvailability(availabilities);
        const locations = availabilities.map((av: { location: any; }) => av.location).filter((loc: { id: any; }, i: any, self: any[]) => loc && self.findIndex(l => l.id === loc.id) === i);

        if (provinceFilter && !locations.some((loc: any) => loc.province?.toLowerCase() === provinceFilter)) {
            return false;
        }


        const supplierReview = await this.getSupplierReviewAverage(supplier.id);

        if (minStars > 0 && (!supplierReview || supplierReview.stars_average < minStars)) {
            return false; // No cumple con el filtro
        }

        const services = await this.loadSupplierServices(supplier.id, specialty_code, procedure_code, minPrice, maxPrice);
        
        const flatPackages = services.flatMap(service =>
            service.procedures.flatMap((proc: { packages: any[]; }) =>
                proc.packages.map((pkg: any) => pkg.reference_price)
            )
        );
        
        const hasValidPrice = flatPackages.some((price: number) => {
            return price >= minPrice && price <= maxPrice;
        });
        
        // Solo aplicar el filtro si min o max price fueron enviados
        if ((minPrice > 0 || maxPrice < Number.MAX_SAFE_INTEGER) && !hasValidPrice) {
            return false;
        }
        

        
        const reviews = await this.getReviewDetailsGroupedBySupplier(supplier.id);
        const reviewsSummary = await this.getReviewDetailAveragesBySupplier(supplier.id);

        const filtersApplied = !!specialty_code || !!procedure_code;
        if (filtersApplied && services.length === 0) return false;

        if (specialty_code || (!specialty_code && !procedure_code)) {
            supplier.search_procedure_name = "Cita de Valoración";
            supplier.search_reference_price = "18000";
        } else if (procedure_code && services.length > 0) {
            let procedureName = "";
            let minDiscountedPrice: number | null = null;
            let originalPrice: number | null = null;

            for (const service of services) {
                for (const proc of service.procedures) {
                    if (proc.procedure.code === procedure_code) {
                        procedureName = proc.procedure.name;
                        for (const pkg of proc.packages) {
                            const price = parseFloat(pkg.reference_price);
                            const discount = parseFloat(pkg.discount || "0");
                            const discounted = price * (1 - discount / 100);
                            if (minDiscountedPrice === null || discounted < minDiscountedPrice) {
                                minDiscountedPrice = discounted;
                                originalPrice = price;
                            }
                        }
                    }
                }
            }
            supplier.search_procedure_name = procedureName || "Procedimiento";
            supplier.search_reference_price = minDiscountedPrice !== null ? `${minDiscountedPrice}` : null;
            supplier.search_original_price = originalPrice !== null ? `${originalPrice}` : null;
        }

        
        supplier.stars_by_supplier = supplierReview?.stars_average ?? null;
        supplier.review_quantity_by_supplier = supplierReview?.quantity ?? null;

        supplier.reviews = reviews;
        supplier.review_details_summary = reviewsSummary;

        supplier.locations = locations;
        supplier.availabilities = availabilities;
        supplier.services = services;
        supplier.date_availability = nextAvailability?.date_availability || null;
        supplier.hour_availability = nextAvailability?.hour_availability || null;
        supplier.location_number = locations.length || 0;

        return true;
    }


    private async getReviewDetailsGroupedBySupplier(supplierId: number): Promise<any[]> {
        const reviewDetails = await this.reviewDetailRepository.findByOptions(false, true, {
            where: {
                review: {
                    appointment: {
                        supplier: { id: supplierId },
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
    
        for (const detail of reviewDetails) {
            const review = detail.review;
            const appointment = review?.appointment;
    
            if (!appointment || appointment.is_deleted) continue;
    
            let existingReview = groupedReviews.find(r => r.id === review.id);
    
            if (!existingReview) {
                existingReview = {
                    id: review.id,
                    customer: review.customer?.id || null,
                    comment: review.comment,
                    is_annonymous: review.is_annonymous,
                    supplier_reply: review.supplier_reply,
                    created_date: review.created_date,
                    updated_date: review.updated_date,
                    stars: []
                };
                groupedReviews.push(existingReview);
            }
    
            existingReview.stars.push(detail.stars_point);
        }
    
        for (const review of groupedReviews) {
            const total = review.stars.reduce((a: number, b: number) => a + b, 0);
            review.stars_average = Math.round(total / review.stars.length);
            delete review.stars;
        }
    
        return groupedReviews;
    }
    
    private async getReviewDetailAveragesBySupplier(supplierId: number): Promise<any[]> {
        const reviewDetails = await this.reviewDetailRepository.findByOptions(false, true, {
            where: {
                review: {
                    appointment: {
                        supplier: { id: supplierId },
                        is_deleted: false
                    }
                }
            },
            relations: [
                "review",
                "review.appointment",
                "review_code"
            ]
        });
    
        const grouped: Record<string, { total: number, count: number, created_date: Date | null }> = {};
    
        for (const detail of reviewDetails) {
            const code = detail.review_code?.code;
            if (!code) continue;
    
            if (!grouped[code]) {
                grouped[code] = { total: 0, count: 0, created_date: detail.created_date };
            }
    
            grouped[code].total += detail.stars_point;
            grouped[code].count += 1;
        }
    
        const result = [];
        for (const code in grouped) {
            const group = grouped[code];
            result.push({
                stars_point_average: Math.round(group.total / group.count),
                review: code,
                created_date: group.created_date
            });
        }
    
        return result;
    }




    private getNextAvailability(availabilities: Availability[]): { date_availability: string, hour_availability: string } | null {
        const now = moment().tz("America/Costa_Rica");
        const nowPlus2 = now.clone().add(2, 'hours');
        const currentWeekday = now.format("dddd").toLowerCase();

        const availableToday = availabilities.find(av => {
            if (av.weekday.toLowerCase() !== currentWeekday) return false;
            const from = moment(av.from_hour, "HH:mm");
            const to = moment(av.to_hour, "HH:mm");
            return from.isBefore(nowPlus2) && to.isAfter(nowPlus2);
        });

        if (availableToday) {
            return {
                date_availability: now.format("DD/MM/YYYY"),
                hour_availability: nowPlus2.format("HH:mm")
            };
        }

        const dayMap: Record<string, number> = {
            monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
            friday: 5, saturday: 6, sunday: 0
        };

        const proximas = availabilities.map(av => {

            const dayIndex = dayMap[av.weekday.toLowerCase()];
            let date = moment().tz("America/Costa_Rica").startOf('day');
            date.day(dayIndex);
            if (date.isBefore(now, 'day') || date.isSame(now, 'day')) {
                date.add(7, 'days');
            }
            
            const fromTime = moment(av.from_hour, "HH:mm");
            const nextDateTime = date.clone().hour(fromTime.hour()).minute(fromTime.minute());
            return { ...av, nextDateTime };
        }).sort((a, b) => a.nextDateTime.valueOf() - b.nextDateTime.valueOf());

        const nextAvailability = proximas[0];
        if (nextAvailability) {
            return {
                date_availability: nextAvailability.nextDateTime.format("DD/MM/YYYY"),
                hour_availability: moment(nextAvailability.from_hour, "HH:mm").format("HH:mm")
            };
        }

        return null;
    }

    private async loadSupplierServices(
        supplierId: number,
        specialty_code: string | null,
        procedure_code: string | null,
        minPrice: number,
        maxPrice: number
    ): Promise<any[]> {
        const specialties = await this.specialtyBySupplierRepository.findByOptions(false, true, {
            where: { supplier: { id: supplierId } },
            relations: ["medical_specialty"]
        });

        const services = [];

        for (const specialty of specialties) {
            if (specialty_code && specialty.medical_specialty.code !== specialty_code) continue;

            const procedures = await this.procedureBySpecialtyRepository.findByOptions(false, true, {
                where: { specialty: { id: specialty.id } },
                relations: ["procedure"]
            });

            const formattedProcedures = [];

            for (const procedure of procedures) {
                if (procedure_code && procedure.procedure.code !== procedure_code) continue;

                const packages = await this.packageRepository.findByOptions(false, true, {
                    where: { procedure: { id: procedure.id }, is_deleted: false },
                    relations: ["product"]
                });

                //const procReview = await this.getProcedureReviewAverage(supplierId, procedure.procedure.code);
                formattedProcedures.push({
                    id: procedure.id,
                    procedure: procedure.procedure,
                    //stars_by_procedure: procReview?.stars_average ?? null,
                    //review_quantity_by_procedure: procReview?.quantity ?? null,
                    packages: packages
                    .filter((pkg: any) => {
                        const price = Number(pkg.reference_price);
                        return price >= minPrice && price <= maxPrice;
                    })
                    .map((pkg: any) => {
                        return {
                            id: pkg.id,
                            product: pkg.product,
                            reference_price: pkg.reference_price,
                            discount: pkg.discount,
                            services_offer: pkg.services_offer,
                            description: pkg.description,
                            is_king: pkg.is_king,
                        };
                    })
                
                });
                
            }

            if (formattedProcedures.length > 0) {
                services.push({
                    id: specialty.id,
                    medical_specialty: specialty.medical_specialty,
                    procedures: formattedProcedures
                });
            }
        }

        return services;
    }

    private async getSupplierReviewAverage(supplierId: number): Promise<{ stars_average: number, quantity: number } | null> {
        const reviewDetails = await this.reviewDetailRepository.findByOptions(false, true, {
            where: {
                review: {
                    appointment: {
                        supplier: { id: supplierId },
                        is_deleted: false
                    }
                }
            },
            relations: ["review", "review.appointment"]
        });
    
        const stars = reviewDetails.map((r: { stars_point: any; }) => r.stars_point);
        if (stars.length === 0) return null;
    
        let total = 0;
        for (const s of stars) {
            total += s;
        }
        return {
            stars_average: Math.round(total / stars.length),
            quantity: stars.length
        };
    }
    
    private async getProcedureReviewAverage(supplierId: number, procedureCode: string): Promise<{ stars_average: number, quantity: number } | null> {
        const reviewDetails = await this.reviewDetailRepository.findByOptions(false, true, {
            where: {
                review: {
                    appointment: {
                        supplier: { id: supplierId },
                        procedure: {
                            procedure: { code: procedureCode }
                        },
                        is_deleted: false
                    }
                }
            },
            relations: ["review", "review.appointment", "review.appointment.procedure", "review.appointment.procedure.procedure" ]
        });
    
        const stars = reviewDetails.map((r: { stars_point: any; }) => r.stars_point);
        if (stars.length === 0) return null;
    
        let total = 0;
        for (const s of stars) {
            total += s;
        }

        return {
            stars_average: Math.round(total / stars.length),
            quantity: stars.length
        };
    }
    
    private async getPackageReviewAverage(supplierId: number, packageCode: string): Promise<{ stars_average: number, quantity: number } | null> {
        const reviewDetails = await this.reviewDetailRepository.findByOptions(false, true, {
            where: {
                review: {
                    appointment: {
                        supplier: { id: supplierId },
                        package: {
                            product: { code: packageCode }
                        },
                        is_deleted: false
                    }
                }
            },
            relations: ["review", "review.appointment", "review.appointment.package", "review.appointment.package.product"]
        });
    
        const stars = reviewDetails.map((r: { stars_point: any; }) => r.stars_point);
        if (stars.length === 0) return null;
    
        let total = 0;
        for (const s of stars) {
            total += s;
        }
        return {
            stars_average: Math.round(total / stars.length),
            quantity: stars.length
        };
    }

}
