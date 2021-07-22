import { Response } from 'express'
import { IReqAuth, Armes } from '../config/interfaces'

import { lanceDe, getModificateur } from "../utils/aideJeu"
import persoModel from '../models/persoModel'
import userModel from '../models/userModel'

const persoCtrl = {
    createPerso: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({err: "Invalid Authentication."})

        try {
            // Get infos from Front
            const { age, name, race, classe, alignement } = req.body

            // Générate value from infos
            const taille = 180
            const poids = 80 
            const niveau = 1
            const bonusMaitrise = 2
            let pdv = 0
            let gold = 0
            let competences
            let equipements
            let armes: Armes[] = []

            let force = lanceDe("4d6")
            let dexterite = lanceDe("4d6")
            let constitution = lanceDe("4d6")
            let intelligence = lanceDe("4d6")
            let sagesse = lanceDe("4d6")
            let charisme = lanceDe("4d6")

            let ca = 10

            // Etapes en fonction de la race
            if (race == "Elfe") {
                dexterite = dexterite + 2
                intelligence = intelligence + 1
                sagesse = sagesse + 1
                const vitesse = 9
            } else if (race == "Humain") {
                force = force + 1
                dexterite = dexterite + 1
                constitution = constitution + 1
                intelligence = intelligence + 1
                sagesse = sagesse + 1
                charisme = charisme + 1
            } else if (race == "Nain") {
                const langue = ['Le commun', 'Le nain']
                const vitesse = 7.5
                constitution = constitution + 2
                sagesse = sagesse + 1
                force = force + 2
            } else if (race == "Halfelin") {
                constitution = constitution + 1
                dexterite = dexterite + 2
                charisme = charisme + 1
            }

            // Etapes en fonction de la classe
            if (classe == "Clerc") {
                pdv = lanceDe("1d8")
                gold = lanceDe("5d4")*10
                competences=['Histoire', 'Médecine', 'Perpicacité', "Religion"]
                equipements=['armure de cuir', "sac d'explorateur"]
                armes=[{
                    name: "Bâton",
                    degat: "1d6"
                }]
            } else if (classe == "Guerrier") {
                pdv = lanceDe("1d10")
                gold = lanceDe("5d4")*10
                competences=['Acrobaties', 'Athlétisme', 'Dressage', "Histoire", 'Intimidation', 'Preception', 'Perspicacité', 'Survie']
                equipements=['cotte de maille', "sac d'explorateur"]
                armes=[{
                    name: "Hachette",
                    degat: "1d6"
                }, {
                    name: "Epee longue",
                    degat: "8d6"
                }]
            } else if (classe == "Magicien") {
                pdv = 6
                gold = lanceDe("4d4")*10
                competences=['Arcanes', 'Histoire', 'Investigation', "Médecine", "Perspicacité", "Religion"]
                equipements=["un grimoire", "sac d'érudit", "sac d'explorateur"]
                armes=[{
                    name: "Dague",
                    degat: "1d4"
                }]
            } else if (classe == "Roublard") {
                pdv = lanceDe("1d8")
                gold = lanceDe("4d4")*10
                competences=['Acrobaties', 'Athlétisme', 'Discrétion', "Escamotage", "Intimidation", "Investigation", "Perception", "Perspicacité", "Persuasion", "Représentation", "Tromperie"]
                equipements=["Armure de cuir", "outils de voleur", "sac de cambrioleur", "sac d'explorateur"]
                armes=[{
                    name: "Dague",
                    degat: "1d4"
                },{
                    name: "Epée courte",
                    degat: "1d6"
                },{
                    name: "Arc court",
                    degat: "1d6"
                }]
            }

            // Mise à jour grade au modificateur
            pdv = pdv + getModificateur(constitution)

            // Save the user
            const perso = new persoModel({
                age,
                name,
                race,
                classe,
                alignement,
                bonusMaitrise,
                niveau,
                poids,
                taille,
                force,
                dexterite,
                constitution,
                intelligence,
                sagesse,
                charisme,
                pdv,
                gold,
                ca,
                competences,
                equipements,
                armes,
                user: req.user._id
            })

            perso.save((err: any) => {
                if (err) return res.status(500).json({err: err.message})

                let user = req.user
                user?.persos.push(perso._id)

                user?.save((err:any) => {
                    if (err) return res.status(500).json({err: err.message})
                
                    res.status(200).json({
                        msg: "Perso créé Success!",
                        perso
                    })
                })
            })
        } catch (err: any) {
            return res.status(500).json({err: err.message})
        }
    },
    listPerso: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({err: "Invalid Authentication."})

        try {
            const persos = await persoModel.find({user: req.user._id})

            res.json(persos)
        } catch (err: any) {
            return res.status(500).json({err: err.message})
        }
    },
    setPerso: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({err: "Invalid Authentication."})

        try {
            const perso = req.body

            let user = req.user
            user.perso = perso._id

            user?.save((err:any) => {
                if (err) return res.status(500).json({err: err.message})
            
                res.status(200).json({
                    msg: "Votre personnage est bien sélectionné !",
                })
            })
        } catch (err: any) {
            return res.status(500).json({err: err.message})
        }
    }
}

export default persoCtrl;