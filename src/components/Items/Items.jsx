import { Link } from "react-router-dom"


function Items({title, description, button, link }){
    return(
        <>
        <div className="item">
                <h3>{title}</h3>
                <p>{description}</p>
                <Link to={link}>
                    <button className="buttonp">{button}</button>
                </Link>
        </div>
        </>
    )
}

export default Items