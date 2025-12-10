const FormField = ({id, label, value, onChange, placeholder, as='input', options=[]}: FormFieldProps) => {
    // since type is a prop, we need to destructure it and say type is an object of string
// const InputToRender =({type}:{type:string})=>{
//   // we were returning new element on each render whihc caused to get out of focus
//   // after typing one letter, thus we used a ternary operator to return the correct element
   
// }
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
       { as === 'textarea'
    ?
        (<textarea
           id={id}
           name={id}
           value={value}
           onChange={onChange}
           placeholder={placeholder}
        />) :
    as === 'select' ?
        ( <select
           id={id}
           name={id}
           value={value}
           onChange={onChange}
        >
              {options.map(({label,value})=>{
                return <option key={value} value={value}>{label}</option>
              })}
        </select>
        ) :
        (<input
           id={id}
           name={id}
           value={value}
           onChange={onChange}
           placeholder={placeholder}
        />)
    }
      
    </div>
  )
}

export default FormField
