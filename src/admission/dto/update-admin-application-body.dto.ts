import { PartialType } from "@nestjs/swagger";
import { CreateAdmissionApplicationDto } from "./create-admission-application.dto";

export class UpdateAdminApplicationBodyDto extends PartialType(CreateAdmissionApplicationDto) {}