import { Router } from "express";
import { roleMiddleware } from "../../middlewares/roleMiddle";
import { authMiddleware } from "../../middlewares/auth.middle";
import * as controller from "./students.controller";
const router= Router ();

//Rutas para los estudiantes:

router.post ("/", authMiddleware, roleMiddleware(["trainer"]), controller.createStudent);
router.get ("/", authMiddleware, roleMiddleware(["trainer"]), controller.getAllStudents);
router.get ("/:id", authMiddleware, roleMiddleware(["trainer"]), controller.getStudentById);
router.put ("/:id", authMiddleware, roleMiddleware(["trainer"]), controller.updateStudent);
router.patch ("/:id/status", authMiddleware, roleMiddleware(["trainer"]), controller.toggleStatusStudent);

export default router;