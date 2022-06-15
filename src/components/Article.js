import axios from 'axios';
import React, { useState } from 'react';


const Article = ({article}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");

    //dateFormater: fonction qui va traiter la date
    const dateFormater = (date) =>{
        let newDate = new Date(date).toLocaleDateString("fr-Fr", {
            year:"numeric",
            month:"long",
            day:"numeric",
            hour:"numeric",
            minute:"numeric",
            second:"numeric"       
        })
        return newDate
    }

    // handleEdit: fonction qui permettra d'éditer

    const handleEdit = ()=>{

        //cet objet data a  été crée pour envoyer à la BD les nouvelles données modifiées
        const data = {
            author: article.author,
            content: editContent ? editContent : article.content,
            date: Date.now()
        }

        //envoi dans la BD les nouvelles données modifiées

        axios
            .put("http://localhost:3008/articles/" + article.id, data)
            .then(() => {
                setIsEditing(false)
            })   
    }

    const handleDelete = () => {
        axios
            .delete("http://localhost:3008/articles/" + article.id)
            window.location.reload()
    }


    return (
        <div className="article" style={{background : isEditing ? "#f3feff"  : "white"}} >
            <div className="card-header">
                {/* defaultValue permet tout simple de mettre la valeur par defaut de notre input/textearea */}
                {
                    isEditing ? (
                        <input type="text" defaultValue={article.author} />
                    ) : (
                        <h3>{article.author}</h3>
                    )
                }
               
                <em>Posté le {dateFormater(article.date)}</em>
            </div>
            {
                isEditing ? (
                    <textarea 
                        defaultValue={editContent ? editContent : article.content} 
                        autoFocus
                        onChange={(e) => 
                            setEditContent(e.target.value)
                    }></textarea>
                ) : (
                      <p>{editContent ? editContent : article.content}</p>  
                )
            }
            <div className="btn-container">
                {
                    isEditing ? (
                        <button onClick={()=> handleEdit()}>Valider</button> 
                    ): (
                        <button onClick={()=> setIsEditing(true)}>Edit</button>
                    )
                }
                
                <button onClick={() => {
                   if (window.confirm("Voulez-vous vraiment supprimer cet article ?")){
                       handleDelete();
                   }
                }}>Supprimer</button>
            </div>
        </div>
    );
};

export default Article;