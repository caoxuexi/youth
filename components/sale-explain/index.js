Component({
    properties: {
        texts:Array
    },
    data: {
        _texts:Array
    },
    observers:{
      "texts":function (texts) {
          this.setData({
              _texts:texts
          })
      }
    },
    methods: {}
});
