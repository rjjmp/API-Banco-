const express = require("express");
const router = express.Router();
const fs = require("fs");

const FILE_NAME = "bancos.json";

function leer() {
    return JSON.parse(fs.readFileSync(FILE_NAME, "utf8"));
}

function guardar(data) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(data, null, 2));
}



router.get("/buscar/nombre/:v", (req, res) => {
    const bancos = leer();
    let r = [];
    bancos.forEach(b => b.personas.forEach(p => {
        if(p.nombre.toLowerCase() === req.params.v.toLowerCase()) r.push({...p, banco: b.nombre});
    }));
    r.length > 0 ? res.json(r) : res.status(404).json({msj: "No encontrado"});
});

router.get("/buscar/apellido/:v", (req, res) => {
    const bancos = leer();
    let r = [];
    bancos.forEach(b => b.personas.forEach(p => {
        if(p.Apellido && p.Apellido.toLowerCase() === req.params.v.toLowerCase()) r.push({...p, banco: b.nombre});
    }));
    r.length > 0 ? res.json(r) : res.status(404).json({msj: "No encontrado"});
});

router.get("/buscar/cuenta/:v", (req, res) => {
    const bancos = leer();
    let r = [];
    bancos.forEach(b => b.personas.forEach(p => {
        if(p.Cuenta == req.params.v) r.push({...p, banco: b.nombre});
    }));
    r.length > 0 ? res.json(r) : res.status(404).json({msj: "No encontrado"});
});

router.get("/buscar/telefono/:v", (req, res) => {
    const bancos = leer();
    let r = [];
    bancos.forEach(b => b.personas.forEach(p => {
        if(p.Telefono == req.params.v) r.push({...p, banco: b.nombre});
    }));
    r.length > 0 ? res.json(r) : res.status(404).json({msj: "No encontrado"});
});

router.get("/buscar/id/:v", (req, res) => {
    const bancos = leer();
    let r = [];
    bancos.forEach(b => b.personas.forEach(p => {
        if(p.id == req.params.v) r.push({...p, banco: b.nombre});
    }));
    r.length > 0 ? res.json(r) : res.status(404).json({msj: "No encontrado"});
});



// Ver todos los bancos
router.get("/", (req, res) => res.json(leer()));

// Ver un banco por su ID
router.get("/:id", (req, res) => {
    const b = leer().find(x => x.id == req.params.id);
    b ? res.json(b) : res.status(404).send("Banco no existe");
});

// AGREGAR PERSONA 
router.post("/:bId/personas", (req, res) => {
    const db = leer();
    const b = db.find(x => x.id == req.params.bId);
    if (!b) return res.status(404).send("Banco no existe");
    const nueva = { id: Date.now(), ...req.body };
    b.personas.push(nueva);
    guardar(db);
    res.json(nueva);
});

// MODIFICAR PERSONA 
router.put("/:bId/personas/:pId", (req, res) => {
    const db = leer();
    const b = db.find(x => x.id == req.params.bId);
    const p = b?.personas.find(x => x.id == req.params.pId);
    if (!p) return res.status(404).send("No encontrado");
    Object.assign(p, req.body);
    guardar(db);
    res.json(p);
});

// ELIMINAR PERSONA
router.delete("/:bId/personas/:pId", (req, res) => {
    const db = leer();
    const b = db.find(x => x.id == req.params.bId);
    if (!b) return res.status(404).send("Banco no existe");
    b.personas = b.personas.filter(x => x.id != req.params.pId);
    guardar(db);
    res.send("Eliminado");
});

module.exports = router;