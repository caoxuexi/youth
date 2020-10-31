Component({
    properties: {
        checked: Boolean
    },

    data: {},

    methods: {
        onCheck(event) {
            let checked = this.properties.checked
            checked = !checked
            this.setData({
                checked
            })
            this.triggerEvent('check', {
                checked
            }, {
                bubbles: true,
                composed: true
            })
        }
    }
})
