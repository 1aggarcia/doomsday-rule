/** Auto scroll nav bar clicks to the correct location */

$(() => {
    $('a[href^="#"]').on('click', function (event) {
        event.preventDefault();

        const container = $(this.hash);
        // offset position based on navbar heigth
        const position = container.offset().top - $('.navigator').outerHeight();  

        $('html, body').animate({scrollTop: position}, 400);
    });
});