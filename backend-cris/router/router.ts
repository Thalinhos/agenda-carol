import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaClientKnownRequestError } from '../generated/prisma/runtime/library.js';
import { setToken } from "../jwt/setToken.mjs";
import { seeder } from "../prisma/seeder.mjs";

import bcrypt from 'bcrypt';
import express from 'express';
// import { verifyToken } from "../jwt/verifyToken.mjs";

export const router = express.Router();
const prisma = new PrismaClient();


// -----------------------------------------------------------------------------
// LOGIN
// router.post('/handleLogin', async (req, res) => {
//   const { usuario, senha } = req.body;

//   try {
//     const user = await prisma.user.findUnique({ where: { nome: usuario } });

//     if (!user) {
//       return res.status(404).json({ errorMessage: "Usuário não encontrado." });
//     }

//     const senhaVerify = await bcrypt.compare(senha, user.senha);
//     if (!senhaVerify) {
//       return res.status(404).json({ errorMessage: "Credenciais inválidas." });
//     }

//     const token = setToken(user.nome);
//     return res.status(200).json({ token });

//   } catch (error) {
//     return res.status(500).json({ errorMessage: "Erro ao fazer login. " + error });
//   }
// });

// router.post('/verify', verifyToken, (req, res) => {
//   return res.status(200).json({ message: req.decoded });
// });

// -----------------------------------------------------------------------------
// GET ALL POSTS
router.get('/getAllPosts', async (req, res) => {
  try {
    const events = await prisma.event.findMany();

    if (!events.length) {
      return res.status(404).json({ errorMessage: "Sem eventos disponíveis." });
    }

    // Ordenação por data usando o formato DD/MM/YYYY
    events.sort((a, b) => {
      const [d1, m1, y1] = a.data.split('/');
      const [d2, m2, y2] = b.data.split('/');
      return new Date(`${y2}-${m2}-${d2}`) - new Date(`${y1}-${m1}-${d1}`);
    });

    return res.json({ message: events });

  } catch (error) {
    return res.status(500).json({ errorMessage: "Erro ao buscar os eventos." });
  }
});

// -----------------------------------------------------------------------------
// ADD POST
router.post('/addPost', async (req, res) => {
  const { descricao, data, hora } = req.body;

  if (!descricao || !data || !hora) {
    return res.status(400).json({ errorMessage: "Valores precisam ser inseridos." });
  }

  try {
    await prisma.event.create({
      data: { descricao, data, hora, createdAt: new Date(), updatedAt: new Date() }
    });
    return res.status(200).json({ message: "Evento inserido com sucesso!" });

  } catch (error) {
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(400).json({ errorMessage: "Descrição já existe! Altere para outra." });
      }
    }

    return res.status(400).json({ errorMessage: "Erro ao inserir valores. Erro: " + error });
  }
});

// -----------------------------------------------------------------------------
// DELETE POST
router.delete('/deletePost/:postId', async (req, res) => {
  const postId = Number(req.params.postId);

  if (!postId) {
    return res.status(400).json({ errorMessage: "Valores precisam ser inseridos." });
  }

  try {
    const exists = await prisma.event.findUnique({ where: { id: postId } });
    if (!exists) {
      return res.status(404).json({ errorMessage: "Evento inexistente. Falha ao excluir." });
    }

    await prisma.event.delete({ where: { id: postId } });
    return res.status(200).json({ message: "Evento excluído com sucesso!" });

  } catch (error) {
    return res.status(404).json({ errorMessage: "Falha ao excluir: " + error });
  }
});

// -----------------------------------------------------------------------------
// UPDATE POST
router.post('/updatePost/:postId', async (req, res) => {
  const postId = Number(req.params.postId);

  const { descricao, data, hora } = req.body;

  if (!descricao || !data || !hora || !postId) {
    return res.status(400).json({ errorMessage: "Valores precisam ser inseridos." });
  }


  try {
    const exists = await prisma.event.findUnique({ where: { id: postId } });
    if (!exists) {
      return res.status(404).json({ errorMessage: "Evento inexistente. Falha ao atualizar." });
    }

    await prisma.event.update({
      where: { id: postId },
      data: { descricao, data, hora, updatedAt: new Date() }
    });

    return res.status(200).json({ message: "Evento atualizado com sucesso!" });

  } catch (error) {
    return res.status(404).json({ errorMessage: "Falha ao atualizar: " + error });
  }
});

// -----------------------------------------------------------------------------
// GET POST FROM DATE
router.get('/getPostFromDate/:dateValue', async (req, res) => {
  const dateValue: string = req.params.dateValue;

  if (!dateValue) {
    return res.status(400).json({ errorMessage: "Valores precisam ser inseridos." });
  }

  const parsedData = dateValue.replaceAll('-', '/')
  // console.log(parsedData)

  try {
    const events = await prisma.event.findMany({ where: { data: parsedData } });

    if (!events.length) {
      return res.status(400).json({ errorMessage: "Data não encontrada no sistema." });
    }

    return res.status(200).json({ message: events });

  } catch (error) {
    return res.status(500).json({ errorMessage: "Erro ao consultar posts." });
  }
});

//edit css color by date
router.post('/editColor/:dateValue', async (req, res) => {
  const { color } = req.body
  const dateValue: string = req.params.dateValue;
  
  if(!color){
    return res.status(400).json({ errorMessage: "Nenhuma cor selecionada" })
  }
  
  const parsedData = dateValue.replaceAll('-', '/')

  try {
    const events = await prisma.event.findMany({ where: { data: parsedData } });

    if (!events.length) {
      return res.status(400).json({ errorMessage: "Data não encontrada no sistema." });
    }

    await prisma.event.updateMany({
      where: { data: parsedData },
      data: { css_bg_color: color, updatedAt: new Date() }
    });

    return res.status(200).json();

  } catch (error) {
    return res.status(500).json({ errorMessage: "Erro ao consultar posts." });
  }
})

// -----------------------------------------------------------------------------
// SEEDER
router.get('/seeder', async (req, res) => {
  try {
    await seeder();
    return res.status(200).json({ message: "Seeder atualizado com sucesso!" });
  } catch (error) {
    return res.status(404).json({ errorMessage: `Falha ao fazer seeder. ${error}.` });
  }
});
