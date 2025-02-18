import {heroes} from "../data/hero.js"

export function HelloWorld() {
  return (
    <div className="Start">
      <h1>Hello World</h1>
    </div>
  )
}
const Suma=(x,y)=>{
    return x+y
}

console.log(Suma(5,5))

const Heroes =()=>{
    return console.log(heroes)
}
Heroes()