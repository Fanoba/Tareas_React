export const Api = () => {
    const apikey = "Fgom8MS2vKqrurDuXUOcfUZuuv0W1hJf";
    const peticion = fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=yourSearchQuery`);
    
    peticion.then(resp => resp.json())
      .then(data => {
        console.log(data.data[0].url);
      })
      .catch(console.warn);
  
    return (
      <div>
       
      </div>
    );
  };
  