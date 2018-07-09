# 4.0.0

+ Breaking Change on Constructure. Change the order of the parameters to this example.
+ Add support to use the connection of Mongoose

````
   let gridFS = new GridFSPromise("test", "mongodb://localhost:27017/test", mongoOptions, __dirname, "attachments");
    
````


# 3.4.0

+ Fix a minor Bug on getFile
