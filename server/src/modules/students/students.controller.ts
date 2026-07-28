import { Request, Response, NextFunction } from "express";
import { createStudent as createStudentService, getAllStudents as getAllStudentsService, getStudentById as getStudentByIdService, updateStudent as updateStudentService, toggleStatusStudent as toggleStatusStudentService } from "./students.service";
//todo os erros vao para o middleware de erro, que vai tratar e enviar a resposta adequada, com next

//criar novo aluno:
export async function createStudent (req: Request, res: Response, next: NextFunction){

   const userId = req.userId; 

   if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

   try {

    const { name, email, phone } = req.body;
    const newStudent = await createStudentService({ name, email, phone }, userId);
    return res.status(201).json(newStudent);
    
   } catch (error) {
    next(error);
   }
}

//trazer todos os alunos do treinador logado:
export async function getAllStudents (req: Request, res: Response, next: NextFunction){

    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      try {
        const students = await getAllStudentsService(userId);
        return res.status(200).json(students);


      } catch (error) {

        next(error);
      }
}


//trazer um aluno pelo id do treinador logado:
export async function getStudentById (req: Request, res: Response, next: NextFunction){

    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      try {

        const { id } = req.params;
        const studentId= Number(id);

        const student = await getStudentByIdService(studentId, userId);

        return res.status(200).json(student);

      } catch (error) {
        next(error);
      }
}


//atualizar um aluno pelo id do treinador logado:
export async function updateStudent (req: Request, res: Response, next: NextFunction){

    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      try {

        const { id } = req.params;
        const studentId= Number(id);
        const { name, email, phone } = req.body;

        const updatedStudent = await updateStudentService(studentId, { name, email, phone, userId });

        return res.status(200).json(updatedStudent);

      } catch (error) {
        next(error);
      }
}


//modificar o status de um aluno (ativo/inativo) pelo id do treinador logado:
export async function toggleStatusStudent (req: Request, res: Response, next: NextFunction){

    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      try {
        const { id } = req.params;
        const studentId= Number(id);

        const updatedStudent = await toggleStatusStudentService(studentId, userId);
        return res.status(200).json(updatedStudent);

      } catch (error) {
        next(error);
      }
}