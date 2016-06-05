module.exports = function(){
  return {
    srcPath: 'src/',
    index: srcPath + 'index.html',
    jsIncludes:[
      /*include all the external js libraries here*/
    ],
    jsFiles:[
      /*include all you main code js files here*/
    ],
    cssIncludes:[
      'node_modules/normalize.css/normalize.css'
      /*include all the external css libraries here*/
    ],
    mainCss: /*Main css file*/ '',
  }
}
