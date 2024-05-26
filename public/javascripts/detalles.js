document.addEventListener('DOMContentLoaded', function() {
    var items = document.querySelectorAll('#pendientes li');
    items.forEach(function(item) {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
});
