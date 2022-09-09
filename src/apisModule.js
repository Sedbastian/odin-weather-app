const apiKey = "a89d97a5f8156e276d76abbdc33383e3";

function lugarAcoordenadas(lugar) {
  let promesaData = fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${lugar}&limit=5&appid=${apiKey}`,
    { mode: "cors" }
	);
	
	promesaData
		.then(function (response) {
			return response.json();
		})
		.then(function (response) {
			console.log(response);
			return(response);
		})
		.catch(function(error) {
			console.log(error);
			return("error");
		})
}

export { lugarAcoordenadas };
