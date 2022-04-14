$(function () {
    var layer = layui.layer
    initArtCateList()


    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });
    })

    //通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败!')
                }
                initArtCateList()
                layer.msg('新增分类成功!')
                //根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    //通过代理的形式，为btn-edit表单绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {

        //弹出一个修改文章分类信息的层
        var indexEdit = null
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类'
            , content: $('#dialog-edit').html()
        });





    })

       //通过代理的形式，为form-edit表单绑定submit事件
       $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败!')
                }
                initArtCateList()
                layer.msg('修改分类成功!')
                //根据索引，关闭对应的弹出层
                layer.close(indexEdit)
            }
        })
    })
})