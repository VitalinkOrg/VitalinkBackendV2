
import request from "supertest";
import path from 'path';
import ConfigManager from '@TenshiJS/config/ConfigManager';

const configPath = path.resolve(__dirname, '../../tenshi-config.json');
const configManager = ConfigManager.getInstance(configPath);
const config = configManager.getConfig();

describe("Supplier Endpoints", () => {

  const jwt = config.TEST.JWT_TEST;
  const apiKey = config.SERVER.SECRET_API_KEY;      
  const baseUrl = config.COMPANY.BACKEND_HOST; 
  let createdSupplierId: any;

  it("should create a new Supplier", async () => {
    const response = await request(baseUrl)
      .post("supplier/add")
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        id_type: "test_id_type",
        card_id: "test_card_id",
        num_medical_enrollment: "test_num_medical_enrollment",
        name: "test_name",
        phone_number: "test_phone_number",
        email: "test_email",
        country_iso_code: "test_country_iso_code",
        province: "test_province",
        city_name: "test_city_name",
        postal_code: "test_postal_code",
        profile_picture_url: "test_profile_picture_url",
        description: "test_description",
        address: "test_address",
        street_number: "test_street_number",
        floor: "test_floor",
        door_number: "test_door_number",
        latitude: "test_latitude",
        longitude: "test_longitude",
        experience_years: "test_experience_years",
        patients_number: "test_patients_number",
        is_hospital: true,
        our_history: "test_our_history",
        mission: "test_mission",
        vision: "test_vision",
        code_card_id_file: "test_code_card_id_file",
        code_medical_license_file: "test_code_medical_license_file",
        gender: "test_gender",
        medical_type: "test_medical_type",
        legal_representative: "test_legal_representative"
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id");

    createdSupplierId = response.body.data.id;
  });

  it("should update an existing Supplier", async () => {
    const response = await request(baseUrl)
      .put(`supplier/edit?id=${createdSupplierId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .send({
        id_type: "test_id_type",
        card_id: "test_card_id",
        num_medical_enrollment: "test_num_medical_enrollment",
        name: "test_name",
        phone_number: "test_phone_number",
        email: "test_email",
        country_iso_code: "test_country_iso_code",
        province: "test_province",
        city_name: "test_city_name",
        postal_code: "test_postal_code",
        profile_picture_url: "test_profile_picture_url",
        description: "test_description",
        address: "test_address",
        street_number: "test_street_number",
        floor: "test_floor",
        door_number: "test_door_number",
        latitude: "test_latitude",
        longitude: "test_longitude",
        experience_years: "test_experience_years",
        patients_number: "test_patients_number",
        is_hospital: true,
        our_history: "test_our_history",
        mission: "test_mission",
        vision: "test_vision",
        code_card_id_file: "test_code_card_id_file",
        code_medical_license_file: "test_code_medical_license_file",
        gender: "test_gender",
        medical_type: "test_medical_type",
        legal_representative: "test_legal_representative"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", createdSupplierId);
  });

  it("should get a Supplier by ID", async () => {
    const response = await request(baseUrl)
      .get(`supplier/get?id=${createdSupplierId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data.id", createdSupplierId);
  });

  it("should get all Supplier with pagination", async () => {
    const response = await request(baseUrl)
      .get(`supplier/get_all`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey)
      .query({ page: 1, size: 10 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should delete an existing Supplier", async () => {
    const response = await request(baseUrl)
      .delete(`supplier/delete?id=${createdSupplierId}`)
      .set("authorization", jwt)
      .set("x-api-key", apiKey);

    expect(response.status).toBe(200);
  });
});
