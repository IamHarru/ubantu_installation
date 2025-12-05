## mini (CRUD) project 📁

## in this project  i just create an simpel usrer create form in this form you can upload 
##the user profile image using the link and you can also check the created user.
## i also edit feature so you can just update user info (image , email , name)

##for making this project i used html ,css , javascript , mongosse,express,docker 

## note : this project can work localy right now 
## for using this just download or clone this repo in your IDE and then install 

# npm ,express , mongoose , docker.
  # i also add ejs in views folder for using it just 
#remove this line or comment this line
app.use(express.static(path.join(__dirname, './public')))
res.sendFile(path.join(__dirname, './public/index.html'))
#and paste this line of code in app.js
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
res.render('filename')


