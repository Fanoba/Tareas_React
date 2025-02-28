import React from "react"

export const Card = ({id, name, sprites = []}) => {
    
return (
    <section style = {{height:350}}>
        <h2 className="text-capitalize"></h2>
        { /*imagenes */ }
        <div>{
        sprites.map( sprite => (
        <img src={sprite} key={sprite} alt={name}/>
            ))
        }
        </div>
    </section>
    )
}
    