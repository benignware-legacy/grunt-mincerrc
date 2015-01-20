#= require jquery/dist/jquery
#= require_self
hello = () ->
  console.log("Hello World!");
  console.log("Asset Path: <%= asset_path('stylesheets/style.css') %>");
   

hello();
