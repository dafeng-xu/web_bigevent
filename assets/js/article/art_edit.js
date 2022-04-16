$(function () {
    var layer = layui.layer
    var form = layui.form
    //通过URLSearchParams 对象，获取url传递的参数
    var params = new URLSearchParams(location.search)
    var id = params.get('id')

   
   



    //1.渲染文章分类列表
    renderArticleCates()

    function renderArticleCates() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!')
                }

                //调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('selectArtCates', res)
                $('[name=cate_id]').html(htmlStr)

                //一定要记得调用 form.render()方法
                form.render()
                  getArticleById()
            }
        })
    }
 

    


    //2.根据文章的id，发起请求获取文章详情，并初始化表单的数据内容
    function getArticleById() {
        //发起文章详情
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败!')
                }

                //获取文章成功
                var art = res.data

                //为form表单赋初始值
                form.val('addArticle', {
                    Id: art.Id,
                    title: art.title,
                    cate_id: art.cate_id,
                    content: art.content
                })

                //初始化富文本编辑器
                initEditor()  //cropper插件自带方法，导入插件即可使用

                //  初始化图片裁剪器
                var $image = $('#image')
               
                //设置图片路径
                $image.attr('src', 'http://www.liulongbin.top:3007' + art.cover_img)

                //  裁剪选项
                var options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview',
                }

                //  初始化裁剪区域  
                $image.cropper(options)
            }
        })
    }

     //3.为选择封面的按钮，绑定点击事件处理函数 选择封面
     $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //4.监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        //获取用户选择的文件
        var files = e.target.files
        if (files.length === 0) {
            return
        }

        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])

        //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $('#image')
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper({
                aspectRatio: 400 / 280,
                preview: '.img-preview',
            })        // 重新初始化裁剪区域
    })

    //定义文章的发布状态
    var art_state = '已发布'

    //为存为草稿按钮,绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //5.为表单绑定 submit 提交事件 发布文章
    $('#form-addArticle').on('submit', function (e) {
        //1.阻止表单的默认提交行为
        e.preventDefault()

        //2.基于 form 表单，快速创建一个FormData 对象
        var fd = new FormData($(this)[0])

        //3.将文章的发布状态，存到fd中
        fd.append('state', art_state)

        //4.将封面裁剪过后的图片，输出为一个文件对象
        $('#image')
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5.将文件对象，存储到fd中
                fd.append('cover_img', blob)

                //6.发起ajax数据请求
                publishArticle(fd)
            })
    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            //注意：如果想服务器提交的是formdata 格式的数据，
            //必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败!')
                }
                layer.msg('修改文章成功!')

                //发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})