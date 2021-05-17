export function ShowModules(props){
  if(props.modules.length===0){
    return(
      <p>no modules</p>
    )
  }else{
    return(
      <div>
        <div>Current Length: {props.modules.length}</div>
        <div>{props.modules.map((module, index) => (
          module.render(index)
        ))}</div>
      </div>
    )
  }
}