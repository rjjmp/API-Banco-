const express = require("express");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");

const FILE_NAME = "bancos.json";
const SECRET_KEY = "mi_clave_super_secreta";

function leer() {
    return JSON.parse(fs.readFileSync(FILE_NAME, "utf8"));
}

////////////////////////////////////////////////////
// LOGIN
////////////////////////////////////////////////////

router.post("/login",(req,res)=>{

const {usuario} = req.body;

if(!usuario){
return res.status(400).json({
error:"Debe enviar un usuario"
});
}

const token = jwt.sign(
{usuario:usuario},
SECRET_KEY,
{expiresIn:"2m"}
);

res.json({
mensaje:"Token generado",
token:token
});

});

////////////////////////////////////////////////////
// VERIFICAR TOKEN
////////////////////////////////////////////////////

function verificarToken(req,res,next){

const header = req.headers["authorization"];

if(!header){
return res.status(401).json({
error:"Token requerido"
});
}

const token = header.split(" ")[1];

jwt.verify(token, SECRET_KEY, (err,decoded)=>{

if(err){
return res.status(403).json({
error:"Token inválido o expirado"
});
}

req.usuario = decoded.usuario;

next();

});

}

////////////////////////////////////////////////////
// INFO API
////////////////////////////////////////////////////

router.get("/info", verificarToken, (req,res)=>{

res.json({
api:"API Bancos",
version:"2.0",
usuario:req.usuario,
descripcion:"Version segura con JWT",
autor:"Rosa Peña"
});

});

// LISTAR TODOS LOS BANCOS


router.get("/", verificarToken, (req,res)=>{

const bancos = leer();

const resultado = bancos.map(b => ({
id:b.id,
nombre:b.nombre,
personas:b.personas.map(p => ({
id:p.id,
nombre:p.nombre,
apellido:p.Apellido,
cuenta:p.Cuenta,
telefono:p.Telefono
}))
}));

res.json({
mensaje:"Bienvenido a la version 2",
usuario:req.usuario,
total_bancos:resultado.length,
data:resultado
});

});

// BUSCAR BANCO POR ID


router.get("/banco/:id", verificarToken, (req,res)=>{

const bancos = leer();
const id = parseInt(req.params.id);

const banco = bancos.find(b => b.id === id);

if(!banco){
return res.status(404).json({
error:"Banco no encontrado"
});
}

res.json(banco);

});

// BUSCAR PERSONA POR NOMBRE

router.get("/persona/:nombre", verificarToken, (req,res)=>{

const bancos = leer();
const nombre = req.params.nombre.toLowerCase();

let resultado = [];

bancos.forEach(b => {

b.personas.forEach(p => {

if(p.nombre.toLowerCase().includes(nombre)){

resultado.push({
banco:b.nombre,
persona:p
});

}

});

});

res.json(resultado);

});



router.get("/persona-id/:id", verificarToken, (req,res)=>{

const bancos = leer();
const id = parseInt(req.params.id);

let persona = null;

bancos.forEach(b => {

b.personas.forEach(p => {

if(p.id === id){
persona = p;
}

});

});

if(!persona){
return res.status(404).json({
error:"Persona no encontrada"
});
}

res.json(persona);

});

module.exports = router;
