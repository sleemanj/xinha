// I18N constants

// LANG: "fr", ENCODING: UTF-8
// Author: Laurent Vilday, mokhet@mokhet.com

// FOR TRANSLATORS:
//
//   1. PLEASE PUT YOUR CONTACT INFO IN THE ABOVE LINE
//      (at least a valid email address)
//
//   2. PLEASE TRY TO USE UTF-8 FOR ENCODING;
//      (if this is not possible, please include a comment
//       that states what encoding is necessary.)

HTMLArea.I18N = {

        // the following should be the filename without .js extension
        // it will be used for automatically load plugin language.
        lang: "fr",

        tooltips: {
                bold:           "Gras",
                italic:         "Italique",
                underline:      "Souligné",
                strikethrough:  "Barré",
                subscript:      "Indice",
                superscript:    "Exposant",
                justifyleft:    "Aligner à gauche",
                justifycenter:  "Centrer",
                justifyright:   "Aligner à droite",
                justifyfull:    "Justifier",
                orderedlist:    "Numérotation",
                unorderedlist:  "Puces",
                outdent:        "Diminuer le retrait",
                indent:         "Augmenter le retrait",
                forecolor:      "Couleur de police",
                hilitecolor:    "Surlignage",
                inserthorizontalrule: "Ligne horizontale",
                createlink:     "Insérer un hyperlien",
                insertimage:    "Insérer/Modifier une image",
                inserttable:    "Insérer un tableau",
                htmlmode:       "Passer au code source",
                popupeditor:    "Agrandir l'éditeur",
                about:          "A propos",
                showhelp:       "Aide",
                textindicator:  "Style courant",
                undo:           "Annuler la dernière action",
                redo:           "Répéter la dernière action",
                cut:            "Couper la sélection",
                copy:           "Copier la sélection",
                paste:          "Coller depuis le presse-papier",
                lefttoright:    "Direction de gauche à droite",
                righttoleft:    "Direction de droite à gauche",
                removeformat:   "Supprimer mise en forme",
                print:          "Imprimer document",
                killword:       "Effacer tags MSOffice"
        },

        buttons: {
                "ok":           "OK",
                "cancel":       "Annuler"
        },

        msg: {
                "Path":         "Chemin",
                "TEXT_MODE":    "Vous êtes en MODE TEXTE.  Appuyez sur le bouton [<>] pour retourner au mode WYSIWYG.",

                "empty-link" :  "Pour créer le lien, vous devez d'abord sélectionner le texte qui servira de lien",
                "IE-sucks-full-screen" :
                // translate here
                "Le mode plein écran peut causer des problèmes sous Internet Explorer, " +
                "dû à des bugs du navigateur que nous n'avons pu contourner pour le moment.  " +
                "Les différents symptômes peuvent être un affichage déficient, le manque de " +
                "fonctions dans l'éditeur et/ou des pannes aléaoires du navigateur.  Si votre " +
                "système est Windows 9x, il est possible que vous subissiez une erreur de type " +
                "General Protection Fault et que vous ayez redémarrer votre ordinateur." +
                "\n\nAppuyez sur OK si vous désirez tout de même passer en plein écran.",

    "MOZ-security-clipboard" :
    // Translate Here
    "Le bouton Coller ne fonctionne pas sur les navigateurs basés sur Mozilla (pour des raisons de sécurité). Pressez simplement CTRL-V au clavier pour coller directement."
        },

        dialogs: {
                // Common
                "OK"                                                : "OK",
                "Cancel"                                            : "Annuler",

                "Alignment:"                                        : "Alignement:",
                "Not set"                                           : "Indéfini",
                "Left"                                              : "Left",
                "Right"                                             : "Right",
                "Texttop"                                           : "Texttop",
                "Absmiddle"                                         : "Absmiddle",
                "Baseline"                                          : "Baseline",
                "Absbottom"                                         : "Absbottom",
                "Bottom"                                            : "Bottom",
                "Middle"                                            : "Middle",
                "Top"                                               : "Top",

                "Layout"                                            : "Mise en page",
                "Spacing"                                           : "Espacement",
                "Horizontal:"                                       : "Horizontal:",
                "Horizontal padding"                                : "Marge horizontale interne",
                "Vertical:"                                         : "Vertical:",
                "Vertical padding"                                  : "Marge verticale interne",
                "Border thickness:"                                 : "Epaisseur de bordure:",
                "Leave empty for no border"                         : "Laisser vide pour pas de bordure",

                // Insert Link
                "Insert/Modify Link"                                : "Insérer/Modifier un lien",
                "None (use implicit)"                               : "Aucun (implicite)",
                "New window (_blank)"                               : "Nouvelle fenêtre (_blank)",
                "Same frame (_self)"                                : "Même frame (_self)",
                "Top frame (_top)"                                  : "Frame principale (_top)",
                "Other"                                             : "Autre",
                "Target:"                                           : "Cible:",
                "Title (tooltip):"                                  : "Titre (tooltip):",
                "URL:"                                              : "URL:",
                "You must enter the URL where this link points to"  : "Vous devez entrer l'URL de ce lien",
                // Insert Table
                "Insert Table"                                      : "Insérer tableau",
                "Rows:"                                             : "Lignes:",
                "Number of rows"                                    : "Nombre de lignes",
                "Cols:"                                             : "Colonnes:",
                "Number of columns"                                 : "Nombre de colonnes",
                "Width:"                                            : "Largeur:",
                "Width of the table"                                : "Largeur du tableau",
                "Percent"                                           : "Pourcent",
                "Pixels"                                            : "Pixels",
                "Em"                                                : "Em",
                "Width unit"                                        : "unité",
                "Positioning of this table"                         : "Position du tableau",
                "Cell spacing:"                                     : "Cellule spacing:",
                "Space between adjacent cells"                      : "Espace entre les cellules adjacentes",
                "Cell padding:"                                     : "Cellules padding:",
                "Space between content and border in cell"          : "Espace entre le contenu et la bordue d'une cellule",
                // Insert Image
                "Insert Image"                                      : "Insérer image",
                "Image URL:"                                        : "Image URL:",
                "Enter the image URL here"                          : "Entrer l'URL de l'image ici",
                "Preview"                                           : "Prévisualiser",
                "Preview the image in a new window"                 : "Prévisualiser l'image dans une nouvelle fenêtre",
                "Alternate text:"                                   : "Text alternatif:",
                "For browsers that don't support images"            : "Pour les navigateurs qui ne supportent pas les images",
                "Positioning of this image"                         : "Position de l'image",
                "Image Preview:"                                    : "Prévisualisation:"
        }
};