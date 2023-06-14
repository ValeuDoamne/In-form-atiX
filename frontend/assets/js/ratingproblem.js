//selectam elementele .stars i(cele 5 stele)
const stars = document.querySelectorAll(".starsRating i");
//console.log(stars);

//trecem prin fiecare
stars.forEach((star, index1)=>{
    //adaugam un event listener pt click
    star.addEventListener("click", () => {
        //console.log(index1);
        //trecem iar prin fiecare
        stars.forEach((star, index2) => {
            //console.log(index2);
            //"coloram" stelele sau le "decoloram" in functie de locul/steaua unde am apasat
            index1 >= index2 ? star.classList.add("ratingChecked") : star.classList.remove("ratingChecked");
        })
    });
});
