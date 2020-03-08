import Vue from 'vue'
import loading from './component'
const Ctor = Vue.extend(loading)
let instance = null
function Loading(Vue){
    Vue.prototype.$loading = {
        show:function(text){
            if(!instance){
                instance = new Ctor()
                instance = instance.$mount()
                instance.text = text
                instance.visible = true
                document.body.appendChild(instance.$el)
            }else{
                instance.text = text
                instance.visible = true
            }
        },
        hide:function(){
            if(!instance) return 
            instance.text = ''
            instance.visible = false
        }
    }
}
export default Loading