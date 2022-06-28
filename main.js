$(document).ready(function () {
  $("#title").autocomplete({
    source: async function (request, response) {
      let data = await fetch(
        `http://localhost:8000/search?query=${request.term}`
      )
        .then((results = results.json()))
        .then((results) =>
          results.map((results) => {
            return {
              label: results.title,
              value: results.title,
              id: results._id,
            };
          })

        )
        response(data)
    },
    minLength:2,
    select: function(event,ui) {
        console.log(ui.item.id)
        fetch(`http://localhost:3000/get/${ui.item.id}`)
        .then(result => result.json())
        .then(results => {
            $('#cast').empty()
            result.cast.forEach (cast =>{
                $(cast).append(`<li>${cast}</li>`)
            })
            $('img').attr('src', results.poster)
        })
    }
  });
});
