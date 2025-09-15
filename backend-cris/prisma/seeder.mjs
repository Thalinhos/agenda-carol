import { PrismaClient } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const adminSenha = process.env.ADMIN_SENHA;

if (!adminSenha) {
  throw new Error("Env value not found.");
}

export async function seeder() {
  try {
    // 1. Verificar usuário admin
    const verifyUser = await prisma.user.findUnique({
      where: { nome: 'admin' },
    });

    if (verifyUser) {
      throw new Error("Usuário já consta no sistema");
    }

    // 2. Verificar evento
    const verifyEvent = await prisma.event.findUnique({
      where: { descricao: "festa de aniversario do thalisson" },
    });

    if (verifyEvent) {
      throw new Error("Evento já consta no sistema");
    }

    // 3. Criar usuário admin
    const adminUser = await prisma.user.create({
      data: {
        nome: 'admin',
        senha: await bcrypt.hash(adminSenha, 10),
      },
    });

    // 4. Criar evento
    const eventTest = await prisma.event.create({
      data: {
        descricao: "festa de aniversario do thalisson",
        data: "16/12/2024",
      },
    });

    console.log('Sucesso ao fazer seed:', {
      adminUser,
      eventTest,
    });

  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// seeder();
