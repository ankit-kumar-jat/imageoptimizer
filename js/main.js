// navbar
var navManu = document.querySelector('.navbar-nav');
var click = 1;
$('#navbarToggle').click(() => {
    if (click === 1) {
        $('.navbar-nav').slideDown("slow", () => {
            click = 0;
        });
    } else {
        $('.navbar-nav').slideUp("slow", () => {
            click = 1;
        });
    }
});
$('section').click(() => {
    if (click === 0){
        $('.navbar-nav').slideUp("slow", () => {
            console.log("also run");
            click = 1;
        });
    }
});
// animation

