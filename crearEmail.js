import nodemailer from 'nodemailer';

async function crearCuenta() {
  try {
    // Esto pide a Ethereal una cuenta nueva automáticamente
    let testAccount = await nodemailer.createTestAccount();

    console.log('--- COPIA ESTO EN TU ARCHIVO MAILER.JS ---');
    console.log('user:', testAccount.user);
    console.log('pass:', testAccount.pass);
    console.log('------------------------------------------');
  } catch (error) {
    console.error(error);
  }
}

crearCuenta();