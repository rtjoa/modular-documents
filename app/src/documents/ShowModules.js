import './ShowModules.css'
export function ShowModules(props){
  if(props.modules.length===0){
    return(
      <span/>
    )
  }else{
    return(
        <div>{props.modules.map((module, index) => (
          <div className="module"> 
            {module.render(index)} 
            <span className="moduleIndex">{index}</span> 
          </div>
        ))}
        </div>
    )
  }
}