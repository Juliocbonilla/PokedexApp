const urlPokemons = "https://pokeapi.co/api/v2/pokemon/";
const urlTypePokemons = "https://pokeapi.co/api/v2/type/";
const urlInfoPokemons = "https://pokeapi.co/api/v2/pokemon-species/";
const urlImgPokemonDetail = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/";
const urlImgPokemonFull = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";

var navNext = $("#navegation__next");
var navBack = $("#navegation__back");
var message = $(".text")

// Eventos
$("#header__home").click(backPokemon);
$("#navegation__back").click(backPokemon);
$("#search__button").click(searchPokemonNumber);
$("#search__button-type").click(searchPokemonType);
$("#navegation__next").click(nextPokemon);


//Funciones

function card(cardPokemon) {
  let idPokemon = cardPokemon.id;
  let idPokemonModal = cardPokemon.id;
  let tall = cardPokemon.height / 10;
  let weight = cardPokemon.weight / 10;
  let namePokemon = cardPokemon.name;
  let stats = cardPokemon.stats;
  let colorType = cardPokemon.types;
  let typeBack = "";
  let typeIcon = "";
  let valueSelect = $("#search__select").val();

  $('.header__logo, #navegation__back, #search__button').click(function () {
    $('select').val('Tipo de pokemon');
  });
  $('.header__logo, #navegation__back, #search__button-type').click(function () {
    $('input').val('');
  });

  if (idPokemon < '10') {
    idPokemon = '00' + idPokemon
  }
  else if (idPokemon < '100') {
    idPokemon = '0' + idPokemon
  }

  if (colorType.length == 1) {
    typeBack += colorType[0].type.name;
  } else {
    typeBack += colorType[1].type.name;
  }

  if (colorType.length < 2) {
    typeIcon += `<div class="type__pokemon"><img class="${colorType[0].type.name}" src="assets/img/icon/${colorType[0].type.name}.svg" alt=""></div>`;
  } else {
    typeIcon += `<div class="type__pokemon"><img class="${colorType[1].type.name}" src="assets/img/icon/${colorType[1].type.name}.svg" alt=""></div>`;
    typeIcon += `<div class="type__pokemon"><img class="${colorType[0].type.name}" src="assets/img/icon/${colorType[0].type.name}.svg" alt=""></div>`;
  }

  $(".card img").on('error', function () {
    $(this).prop('src', 'assets/img/nofound.png');
  });

  $(".main").append(
    `<div class="card col-sm-6 col-md-4 col-xl-3">
        <img src="${urlImgPokemonDetail + idPokemon}.png" class="card__img" alt="${namePokemon}">
        <div class="card__circle"></div>
        <div class="card-body ${typeBack}" id='${valueSelect}'>
            <h5>#${idPokemon}</h5>
            <h1 class="card-title">${namePokemon}</h1>
            <div class="card__type">
                ${typeIcon}
            </div>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter${idPokemon}"> Ver Gráfica </button>
        </div>
     </div>`
  );
  modalPokemon(idPokemon, typeBack, namePokemon, tall, weight, stats, idPokemonModal, typeIcon);
}


function modalPokemon(idPokemon, typeBack, namePokemon, tall, weight, stats, idPokemonModal, typeIcon) {

  $.get(urlInfoPokemons + idPokemonModal, (dataPokemon) => {
    let descriptionPokemon = dataPokemon.flavor_text_entries[26].flavor_text;

    // Escapa las comillas simples
    namePokemon = namePokemon.replace(/'/g, "\\'");
    descriptionPokemon = descriptionPokemon.replace(/'/g, "\\'");

    $(".main").append(
`<div class="modal fade" id="exampleModalCenter${idPokemon}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content ${typeBack}">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">#${idPokemon}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <img src="assets/img/close.svg">
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="modal__info col-12 col-md-6">
                            <h1 class="modal__name">${namePokemon}</h1>
                            <div class="modal__pokemon col-12">
                                <img src="${urlImgPokemonFull + idPokemon}.png" alt="...">
                            </div>
                            <div class="modal__type">
                                ${typeIcon}
                            </div>
                            <div class="modal__features col-12">
                                <p>${tall}m</p>
                                <p>${weight}kg</p>
                            </div>
                            <div class="modal__description col-12">
                                <p>${descriptionPokemon}</p>
                            </div>
                        </div>
                        <div class="modal__graphic col-12 col-md-6">
                            <h1>Habilidades</h1>
                            <div id="chartContainer${idPokemon}"></div>
                        </div>
                        <div class="modal__graphic col-12 col-md-6">
                            <button type="button" class="btn btn-primary" onClick="capturePokemon('${namePokemon}', '${idPokemon}')">Capturar Pokémon</button>
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    </div>`
    );

    var chart = new CanvasJS.Chart("chartContainer" + idPokemon, {
      animationEnabled: true,
      theme: "light1", // "light1", "light2", "dark1", "dark2"
      backgroundColor: "transparent",
      axisY: {
        title: "",
      },
      data: [
        {
          type: "column",
          showInLegend: false,
          legendMarkerColor: "black",
          dataPoints: [
            { y: stats[0].base_stat, label: "Velocidad" },
            { y: stats[3].base_stat, label: "Defensa" },
            { y: stats[4].base_stat, label: "Ataque" },
            { y: stats[5].base_stat, label: "Puntos de vida" },
          ],
        },
      ],
    });
    chart.render();
  });
}



function error(text) {
  $(".main").html(`
      <div class="alert alert-danger" role="alert">
        <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>    
        ${text}
      </div>`
  )
}

function nextPokemon() {
  homePokemon(Next);
}

function backPokemon() {
  homePokemon(urlPokemons + '?offset=0&limit=40');
  message.css({ "display": "none" });
  $(".main").html("");
}

homePokemon();

function homePokemon(url) {
  navNext.css({ "display": "flex"});
  navBack.css({ "display": "none" });
  if (!url) {
    url = urlPokemons + '?offset=0&limit=40';
  }
  $.get(url, (data) => {
    Next = data.next
    if (Next == urlPokemons + '?offset=960&limit=4') {
      message.append("<h3>Opss... No hay mas pokemones por el momento</h3>");
      navNext.css({ "display": "none" });
      navBack.css({ "display": "flex" });
    }
    console.log(Next)
    data.results.forEach((resultPokemon) => {
      $.get(resultPokemon.url, (totalPokemon) => {
        card(totalPokemon);
      });
    });
  });
}

function searchPokemonNumber() {
  navNext.css({ "display": "none" });
  navBack.css({ "display": "flex"});
  let id = $("#idPokemon").val();

  if (id === "") {
    error('Ingrese un número o nombre de pokemon válido')
    return false;
  }
  $(".main").html("");
  let idResult = urlPokemons + id.toLowerCase();

  $.get(idResult, (idPokemon) => {
    card(idPokemon);
    $("#idPokemon").val('');
  }).fail(function (jqXHR, textStatus, errorThrown) {
    error('El pokemos que buscas no existe, intentalo de nuevo')
  });
}

$.get(urlTypePokemons, (type) => {
  type.results.forEach((typePokemon) => {
    $("#search__select").append(`<option class="search__option">${typePokemon.name}</option>`);
  });
});

function searchPokemonType() {
  navNext.css({ "display": "none" });
  navBack.css({ "display": "flex"});
  let typeValue = $("#search__select").val();

  if (typeValue === null) {
    error("Seleccionar un tipo de pokemon");
    return false;
  }

  let urltypeValue = urlTypePokemons + typeValue;
  $.get(urltypeValue, (searchPokemonValue) => {
    if (searchPokemonValue.pokemon.length == 0) {
      error("No hay pokemones por ahora")
      return false;
    }
    $(".main").html("");
    searchPokemonValue.pokemon.forEach((searchPokemon) => {
      $.get(searchPokemon.pokemon.url, (searchPokemonCard) => {
        card(searchPokemonCard);
      });
    });
  });
}


function capturePokemon(namePokemon, idPokemon){
  console.log(`Pokemon capturado ${namePokemon} - ${idPokemon}`);

  const data = {
    idPokemon: idPokemon,
    pokemonName: namePokemon
};

fetch('https://dastogzga5.execute-api.us-east-1.amazonaws.com/capturePokemon', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error en la red');
    }
    return response.json();
})
.then(data => {
  alert('Se ha capturado el Pokemon')
    console.log(data)
})
.catch(error => {
    document.getElementById('output').innerHTML = `<p>Error: ${error.message}</p>`;
});

}


$(document).ready(function() {
  $("#get__button-type").click(function() {
      fetchPokemons();
  });
});

$(document).ready(function() {
  $("#get__button-type").click(function() {
      fetchPokemons();
  });
});

function fetchPokemons() {
  $.get("https://dastogzga5.execute-api.us-east-1.amazonaws.com/getPokemons", (response) => {
      console.log(response); // Verifica la estructura de la respuesta

      // Limpiar la tabla antes de llenar
      $("#pokemonTable tbody").empty();

      // Acceder a los Pokémon en el cuerpo de la respuesta
      const pokemons = response.body.pokemons;

      // Iterar sobre cada Pokémon en la respuesta
      pokemons.forEach((pokemon) => {
          const idPokemon = pokemon.idPokemon || "ID desconocido";
          const namePokemon = pokemon.pokemonName || "Nombre desconocido";
          const captureDate = pokemon.captureDate || "Fecha desconocida";

          // Agregar fila a la tabla
          $("#pokemonTable tbody").append(
              `<tr>
                  <td>${idPokemon}</td>
                  <td>${namePokemon}</td>
                  <td>${new Date(captureDate).toLocaleString()}</td>
                  <td>
                      <button class="btn btn-info" onclick="showModal('${idPokemon}', '${namePokemon}', '${captureDate}')">Ver Detalles</button>
                  </td>
              </tr>`
          );
      });
  }).fail(function() {
      console.error("Error al obtener los Pokémon");
  });
}

function showModal(idPokemon, namePokemon, captureDate) {
  // Aquí puedes crear el modal como lo hicimos antes o mostrar un alert
  alert(`ID: ${idPokemon}\nNombre: ${namePokemon}\nFecha de Captura: ${captureDate}`);
}