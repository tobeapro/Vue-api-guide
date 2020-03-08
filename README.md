> Vue定义了一些API，然后把它放在Vue对象上方便在Vue项目中全局使用


### Vue.extend
`Vue.extend`的参数为一个组件的options，然后返回一个构造函数用于生成新组件。options有哪些属性呢，想象一下平时我们写的Vue组件，主要有`template`、`data`、`methods`还有生命周期函数等等。

demo的话可以查看[Vue文档](https://cn.vuejs.org/v2/api/#Vue-extend)

```js
function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
      }

      var name = extendOptions.name || Super.options.name;
      if (name) {
        validateComponentName(name);
      }

      var Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }
```

接下来我们通过源码来查看,通过`initExtend`函数定义`Vue.extend`方法，`Vue.cid`等于0，也就是后面代码中的`SuperId`是不会变的，而变量`cid`表示组件id放在构造函数上，新组件通过自增来保持id唯一。
直接看`Vue.extend`对应的方法吧，`extendOptions`参数就是前面说的传入的组件options，为了方便我们把组件参数称作`OPTIONS`，执行函数是此时`Super`等于this也就是指向Vue，访问`OPTIONS`中的`_Ctor`，字面意思和后面的操作，可以看出来就是如果缓存了构造函数就直接返回。
这里我们以创建一个新的组件构造函数的思路来看代码。首先检验下，`OPTIONS`中的name是否符合规范，后面就是主要部分了，声明组件的构造函数`Sub`，子类`Sub`继承父类Vue，然后将构造函数指回自己，然后定义自己的组件id，合并options，定义一个属性super指向Vue。
接下来有一段注释说明，通过代理的方式来访问`props`和`computed`，然后再Vue挂载的方法也挂载到`Sub`上....反正很多挂载为了方便访问。
而定义`Sub.sealedOptions`属性时，使用一个`extend`方法，这个跟Vue.extend没关系，就是实现了类似`Object.assign`的功能。
最后执行`cachedCtors[SuperId] = Sub`，就是把构造函数存进`OPTIONS`属性`_Ctor`中，这就解释了前面的构造函数缓存，这样避免构造函数被重复创建。

结合平时业务，我们使用`elementUI`的`message`消息提示时，是直接在Vue实例上通过`this.$message`方法调用，如果像弹框那样把组件标签放在组件模板中通过显示隐藏来控制太麻烦了。所以这里我们举个栗子，实现一个通过函数式使用loading组件
```html
<!-- 定义组件基本参数 -->
<template>
    <div class="loading-wrap" v-show="visible">
        <div class="loading-box">
            <div class="loading"></div>
            <div class="text" v-show="!!text">{{text}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'loading',
        data(){
            return {
                visible:false,
                text:''
            }
        }
    }
</script>

<style scoped>
    /* css */
</style>
```

```js
// 封装插件方法
import Vue from 'vue'
import loading from 'loading参数' 
const Ctor = Vue.extend(loading)  // 生成构造函数
let instance = null
function Loading(Vue){
    // 这样在每个Vue组件实例中都可以使用了
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

```
最后再`main.js`中使用`Vue.use`注册插件。

[在线demo地址](https://tobeapro.github.io/static/vue-api-guide)
[完整项目地址](https://github.com/tobeapro/vue-api-guide)

### Vue.nextTick
对应nextTick方法，Vnode更改后，触发的DOM更新是异步的，Vnode修改到DOM更新完成作为一个事件循环。这样如果想要访问更新后的DOM就要在下一个Tick开始的时候。
```js
function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }
```
`callbacks`存放下一个Tick需要执行的回调，这里看到使用nextTick的两种形式，一种是回调函数作为nextTick的参数、一种通过是Promise中resolve方法。通过`pending`变量控制每次只执行一次`timerFunc`，可以看到这一系列都是同步的操作，nextTick执行后，就执行`timerFunc`方法。
查看`timerFunc`，这里就是做了一些兼容处理，目的就是让`flushCallbacks`方法异步执行。`flushCallbacks`就是把`callbacks`存的方法拿出来挨个执行一遍。

这里再看个例子
```html
<template>
    <div class="common-wrap">
        <h2>nextTick演示</h2>
        <h3 id="msg1">{{msg1}}</h3>
        <h3 id="msg2">{{msg2}}</h3>
        <button @click="handleNextTick">点我点我</button>
    </div>
</template>

<script>
    export default {
        name:'nextTickDemo',
        data(){
            return {
                msg1:'内容1',
                msg2:'内容2'
            }
        },
        methods:{
            handleNextTick(){
                this.msg1 = '内容1修改'
                this.$nextTick(()=>{
                    console.log(document.querySelector('#msg2').textContent) // #1
                    console.log('视图更新啦1')
                })
                this.$nextTick(()=>{
                    console.log('视图更新啦2')
                })
                this.msg2 = '内容2修改'
            }
        }
    }
</script>
```
上面按钮在点击后，第一个nextTick回调中，`#1`那一行输出的值应该是`内容2修改`，对应后面修改后的值，这里也好解释。`handleNextTick`执行后，赋值和$nextTick函数执行都是同步执行的，当`msg1`修改后，它会先生成一个异步任务，而$nextTick回调函数在第二个异步任务中执行。后面的`msg2`赋值时，因为它和`msg1`在同一个`wathcer`对象中，所以不会生成新的异步任务。所以$nextTick回调函数执行时，`msg1`和`msg2`对应的DOM都已经更新好了。

### Vue.set
给响应式对象的设置响应式属性，了解或者看过Vue源码都知道初始化Vue实例时，通过`Object.defineProperty`设置对象属性描述符的方式来实现响应式的，所以当直接新增一个新属性时，Vue无法检测到。
查看set方法，结尾部分`defineReactive$$1`代理新属性，新属性也没必要在这里做依赖收集了，直接更新再新的Vnode中依赖收集就行了。

### Vue.delete
删除属性，直接删除某个属性Vue也无法检测到，文档也说了你应该很少用到，想触发响应也可以直接把属性赋值null或者undefined。

### Vue.directive
自定义指令，可以用来减少编写一些重复代码，不太好讲。查看文档再结合源码中`v-model`如何封装就行了。

### Vue.filter
过滤器，这个使用比较简单，因为看看demo就行了。
> Vue源码中使用`ASSET_TYPES`数组保存了`component`、`directive`、`filter`三个字符串，这三个方法注册特殊点。

### Vue.component
平时用来全局注册组件的方法，实际上该方法是做的事情是生成组件构造函数。方法第一个参数是组件名；第二个参数是组件options（第二个参数如果为空就是返回该组件名的构造函数）。注册时使用`Vue.extend`返回组件的构造函数，并保存在`Vue.options.components`对象中，键值使用组件名访问。

### Vue.use
用于安装Vue插件的方法，接受一个函数或者对象的插件，如果是对象的话必要要有install方法，如果是函数就把它当成install方法执行，调用时会把Vue当成第一个参数传进去。
```js
function initUse (Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }
```
查看源码，会在Vue中定义一个`_installedPlugins`数组，这样控制每个插件只会注册一次。`unshift`把Vue加到第一个参数上。插件方法执行完再存进_installedPlugins，最后返回Vue，这样`Vue.use`就可以形如：Vue.use(插件1).use(插件2)的链式使用了。

### Vue.mixin
全局混入方法或属性，因为改变的是Vue.options，这个都会merge进所有的Vue实例，所以每个组件都可以访问到。比如我们的`vue-router`和`vuex`就是在全局混入`beforeCreate`周期函数，然后周期函数执行中添加了`$router`和`$store`属性，这样每个组件中都能访问到了。

### Vue.compile
官方解释：将一个模板字符串编译成 render 函数，只在完整版时可用。我：这里就不分析了，不够深入了解。

### Vue.observable
让一个对象可响应，查看源码

```js
Vue.observable = function (obj) {
    observe(obj);
    return obj
};
```
可以看到和初始化组件一样都是使用`observe`使对象实现可响应的。这里也使用一个小栗子来演示一下。
```js
<script>
    import Vue from 'vue'
    let normalData = {
        key: '这是一个普通的属性值'
    }
    export default {
        name:'observableDemo',
        render(h){
            return h(
                'h3', 
                {
                    class:"common-wrap"
                },
                 `变成可响应的对象，一秒后属性会被修改：${normalData.key}`
            )
        },
        created(){
            Vue.observable(normalData)
            window.setTimeout(()=>{
                normalData.key = '这是一个响应后的属性值'
            },1000)
        }
    }
</script>
```

### Vue.version
返回Vue版本号


##### 以上就是Vue文档中全局API的一些解析