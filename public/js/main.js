$(document).ready(function(){
    $('.delete-user').on('click', function(){
        var id = $(this).data('id');
        var url = '/delete/' + id;
        if(confirm('Delete User?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleteing user...');
                    window.location.href='/';
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });
    $('.edit-user').on('click', function(){
        $('#edit-form-first-name').val($(this).data('first-name').replace(/\s/g, ''));
        $('#edit-form-last-name').val($(this).data('last-name').replace(/\s/g, ''));
        $('#edit-form-first-name1').val($(this).data('first-name').replace(/\s/g, ''));
        $('#edit-form-last-name1').val($(this).data('last-name').replace(/\s/g, ''));
        $('#edit-form-domain').val($(this).data('domain').replace(/\s/g, ''));
        $('#edit-form-email').val($(this).data('email'));
        $('#edit-form-password').val($(this).data('password').replace(/\s/g, ''));
        $('#edit-form-username').val($(this).data('username').replace(/\s/g, ''));
        $('#edit-form-last').val($(this).data('last').replace(/\s/g, ''));
        $('#edit-form-id').val($(this).data('id'));
       
    })
});

