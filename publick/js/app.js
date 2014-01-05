var toysTemplate = _.template( $('#toys-template').html() ),
    toyTemplate = _.template( $('#toy-template').html() ),
    submitTemplate = _.template( $('#submit-template').html() ),
    vent = {},
    data = [],
    toy = {},
    order = {},

    bearsData = [{"articul":"00001","name":"Мишка-братишка","img":"cat.jpg","price":"1000"},{"articul":"00002","name":"Мишка-топтыжка","img":"cat.jpg","price":"1010"},{"articul":"00003","name":"Мишка-юрист","img":"cat.jpg","price":"2000"},{"articul":"00004","name":"Мишка-малой","img":"cat.jpg","price":"999"},{"articul":"00005","name":"Мишка-большой-братишка","img":"cat.jpg","price":"1000"},{"articul":"00006","name":"Мишка длинное название","img":"cat.jpg","price":"1010"},{"articul":"00007","name":"Мишка-эффективный","img":"cat.jpg","price":"1029"},{"articul":"00008","name":"Мишка-лень","img":"cat.jpg","price":"1001"}],

    minionData = [{"articul":"10001","name":"Миньон-братишка","img":"dog.jpg","price":"1000"},{"articul":"10002","name":"Миньон-топтыжка","img":"dog.jpg","price":"1010"},{"articul":"10003","name":"Миньон-юрист","img":"dog.jpg","price":"2000"},{"articul":"10004","name":"Миньон-малой","img":"dog.jpg","price":"999"},{"articul":"10005","name":"Миньон-большой-братишка","img":"dog.jpg","price":"1000"},{"articul":"10006","name":"Миньон длинное название","img":"dog.jpg","price":"1010"},{"articul":"10007","name":"Миньон-эффективный","img":"dog.jpg","price":"1029"},{"articul":"10008","name":"Миньон-лень","img":"dog.jpg","price":"1001"}];

_.extend(vent, Backbone.Events);

vent.on('modal:open', function(model) {
    this.modalView = new ModalView({
        model: model
    });
    this.modalView.render();
    $('#order-modal').modal('toggle');
});

vent.on('modal:close', function() {
    this.modalView.removeView(); // remove only HTML, not el
})

$('#order-modal').on('hide.bs.modal', function() {
    vent.trigger('modal:close');
});

// загружаем картинки при заходе в первый таб
data = bearsData;
$('.toys').html( toysTemplate(bearsData) );

$('.js-tab').on('click',function (e) {
    var currentData = $(this).attr('href').slice(1);
    switch (currentData) {
        case 'bear':
            data = bearsData;
            $('.toys').html( toysTemplate(bearsData) );
        break;
        case 'minion':
            data = minionData;
            $('.toys').html( toysTemplate(minionData) );
        break;
    }
    e.preventDefault();
    $('.js-tab').removeClass('btn-border-black');
    $(e.currentTarget).addClass('btn-border-black');
    $(this).tab('show')
});

var ToyModel = Backbone.Model.extend({
    defaults: {
        price: 1000,
        material: 'шерсть'
    },
    render: function() {
        console.log(this.attributes);
        $('#order-modal').modal('toggle');
    }
});

var ToyView = Backbone.View.extend({
    'el':'.toys',
    'events': {
        'click .js-readmore, .js-order': 'openModal'
    },

    openModal: function(e) {
        var $parent = $(e.currentTarget).closest('.toy'),
            code = $('.js-toy-code',$parent).text(),
            name = $('.toy-info__name',$parent).text(),
            img = $('.toy__image',$parent).attr('src'),
            price = $('.js-toy-price',$parent).text();

        this.model.set({
            code: code,
            name: name,
            img: img,
            price: price
        });

        vent.trigger('modal:open', this.model);
    }
});

var ModalView = Backbone.View.extend({
    'events': {
        'click .js-send-order': 'submitOrder'
    },
    'el':'.js-popup',
    initialize: function() {
        toy = {
            code: this.model.get('code'),
            name: this.model.get('name'),
            img: this.model.get('img'),
            price: this.model.get('price'),
            material: this.model.get('material')
        }
    },
    render: function() {
        this.$el.html( toyTemplate(toy) );
        this.$phone = this.$el.find(".js-phone");
        this.$phone.mask("+7 (999) 999-99-99");
    },
    removeView: function() {
        this.undelegateEvents();
        this.$el.empty();
        this.stopListening();
        return this;
    },
    submitOrder: function() {
        order.phone = this.$phone.val();
        if ( order.phone ) {
            this.$el.find('.info__item_error').fadeOut(200);
            this.$el.html( submitTemplate(order) );
        } else {
            this.$el.find('.info__item_error').fadeIn(200);
        }
    }
});

var toyView = new ToyView({
    model: new ToyModel()
});
