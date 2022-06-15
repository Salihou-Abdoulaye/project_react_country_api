import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Article from '../components/Article';
import Logo from '../components/Logo'
import Navigation from '../components/Navigation'

const Blog = () => {
    // Pour recuperer les informations qui seront entrées dans textarea un declare cette variable
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");

    // Pour renoyer une erreur lorsque le texte<140  dans textarea un declare cette variable..
    //  au debut il sera sur false et lorsque setContent<140 il passe sur true et sa affiche l'erreur
    const [error, setError] = useState(false);

    const [blogData, setBlogData] = useState([]);

    //getData: fonction qui recupère les données dans la base des données
    const getData = () =>{
        axios
            .get("http://localhost:3008/articles")
            .then((res) => setBlogData(res.data))
    }

    //useEffect: quand tu monte le composant je veux que tu me joue  ce qui est à linterieur de useEffect
    useEffect(() => getData(), []);

    // cette fonction permet au formulaire de n'est pas recharger la page lorsque on appuie sur envoyer
    //en le privant son comportement par defaut avec "preventDesfault()"
    const handleSubmit = (e) => {
        e.preventDefault();

        // Nous devons faire une condition if pour que sa renvoie un message d'erreur lorsque le texte entré est inferieur à 140
        if (content.length < 140) {
            setError(true);
        }else{

            //post: pour envoyer les données dans la base des données 
            axios.post("http://localhost:3008/articles", {
                author,
                content,
                date: Date.now()
            })
            setError(false)

            //vider le formulaire lorsqu'on envoie les données à la BD
            setAuthor("")
            setContent("")

            // mettre à jour la base des données pour afficher
            getData()
        }
        
    }

    return (
        <div className='blog-container'>
            <Logo/>
            <Navigation/>
            <h1>Blog</h1>

            {/* onSubmit: un évenement qui permettra au formulaire de n'est pas se recharger 
            en interpretantla fonction handleSubmit definit plus haut */}
            <form onSubmit={(e) => handleSubmit(e)}>
                <input 
                    type="text" 
                    placeholder='Nom'
                    onChange={(e)=>{
                        setAuthor(e.target.value)
                    }}
                    value={author}
                /> 

                {/* Nous declarons cet évenement dans onChange dans textarea pour recuperer les informations tapées pour modifier */}
                <textarea 

                    // conditionner l'error en ajoutant des bordures rouges
                    style={{border : error ? "1px solid red " : "1px solid #61dafb"}}

                    placeholder='Message'
                    value={content} 
                    onChange={(e) => 
                        setContent(e.target.value)
                    }>
                </textarea>

                {/* Ceci veut dire que si error === true sa affice le message d'erreur */}
                {error && <p>Veuillez ecrire au moins 140 caractères</p>}
                <input type="submit" value="Envoyer"/>
            </form>
            <ul>{blogData
                .sort((a,b) =>(b.date - a.date))
                .map((article)=>(
                    <Article key={article.id} article={article}/>
                ))}
            </ul>
        </div>
    );
};

export default Blog;