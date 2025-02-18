import React from 'react'
import {heroes} from "../data/hero.js"

export function PrimerComponent() {
    const nombre = "Gilberto";
    const apellido = "Camacho";

    const nombrecompleto = `${nombre} ${apellido}`; // Usa backticks (`) en lugar de comillas simples
    console.log(nombrecompleto);
    
    
}
function getSaludo(nombre){
    return "Hola " + nombre; 
}

console.log(getSaludo("Angel"));

function Arreglo(){
    const arreglo=[1,2,3,4,5];
    arreglo.push(10)
    arreglo.pop()
    let arreglo2=[...arreglo,48]
    return arreglo2;
}
console.log(Arreglo());

function Dobles(){
    const arreglo3=[1,2,3,4,5];
    return arreglo3.map(function (x){
        return x*2;
    })
}
console.log(Dobles());

const NewFuncion = ()=>{
    return "Hey";
}

console.log(NewFuncion())

const Heroes =()=>{
    return console.log(heroes)
}
Heroes()