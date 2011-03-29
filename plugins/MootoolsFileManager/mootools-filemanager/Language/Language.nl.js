/*
Script: Language.nl.js
	MooTools FileManager - Language Strings in Dutch

Translation:
	[Dave De Vos](http://wnz.be)
*/

FileManager.Language.nl = {
	more: 'Details',
	width: 'Breedte:',
	height: 'Hoogte:',

	ok: 'Ok',
	open: 'Kies bestand',
	upload: 'Uploaden',
	create: 'Maak map',
	createdir: 'Geef een map-naam op:',
	cancel: 'Annuleren',
	error: 'Fout',

	information: 'Informatie',
	type: 'Type:',
	size: 'Grootte:',
	dir: 'Locatie:',
	modified: 'Laatste wijziging:',
	preview: 'Voorbeeld',
	close: 'Sluiten',
	destroy: 'Verwijderen',
	destroyfile: 'Ben je zeker dat je dit bestand wil verwijderen?',

	rename: 'Naam wijzigen',
	renamefile: 'Geef een nieuwe bestandsnaam op:',

	download: 'Downloaden',
	nopreview: '<i>G��n voorbeeld beschikbaar</i>',

	title: 'Titel:',
	artist: 'Artiest:',
	album: 'Album:',
	length: 'Lengte:',
	bitrate: 'Bitrate:',

	deselect: 'Deselecteren',

	nodestroy: 'Het is niet mogelijk bestanden te verwijderen op deze server.',

	'backend.disabled': 'Deze operatie is uitgeschakeld op deze server.',
	'backend.authorized': 'Je hebt geen toestemming om deze aktie uit te voeren.',
	'backend.path': 'Deze map bestaat niet.  Contacteer de beheerder van deze website voor hulp.',
	'backend.exists': 'Deze locatie bestaat reeds. Contacteer de beheerder van deze website voor hulp.',
	'backend.mime': 'Dit bestandstype is niet toegelaten.',
	'backend.extension': 'Het bestand heeft een onbekende of niet-toegelaten extensie.',
	'backend.size': 'Het bestand is te groot voor verwerking.  Probeer opnieuw met een kleiner bestand.',
	'backend.partial': 'Het bestand dat je verstuurde werd slechts gedeeltelijk ontvangen, probeer het bestand opnieuw te versturen.',
	'backend.nofile': 'Er werd g��n bestand verstuurd of het bestand / folder kon niet worden gevonden.',
	'backend.default': 'Er ging iets fout bij het uploaden van het bestand.',

	'backend.nonewfile': 'A new name for the file to be moved / copied is missing.',
	'backend.corrupt_img': 'This file is a not a image or a corrupt file: ', // path
	'backend.copy_failed': 'An error occurred while copying the file / directory: ', // oldlocalpath : newlocalpath
	'backend.delete_thumbnail_failed': 'An error occurred when attempting to delete the image thumbnail',
	'backend.mkdir_failed': 'An error occurred when attempting to create the directory: ', // path
	'backend.move_failed': 'An error occurred while moving / renaming the file / directory: ', // oldlocalpath : newlocalpath
	'backend.path_tampering': 'Path tampering detected.',
	'backend.realpath_failed': 'Cannot translate the given file specification to a valid storage location: ', // $path
	'backend.unlink_failed': 'An error occurred when attempting to delete the file / directory: ',  // path

	// Image.class.php:
	'backend.process_nofile': 'The image processing unit did not receive a valid file location to work on.',
	'backend.imagecreatetruecolor_failed': 'The image processing unit failed: GD imagecreatetruecolor() failed.',
	'backend.imagealphablending_failed': 'The image processing unit failed: cannot perform the required image alpha blending.',
	'backend.imageallocalpha50pctgrey_failed': 'The image processing unit failed: cannot allocate space for the alpha channel and the 50% background.',
	'backend.imagecolorallocatealpha_failed': 'The image processing unit failed: cannot allocate space for the alpha channel for this color image.',
	'backend.imagerotate_failed': 'The image processing unit failed: GD imagerotate() failed.',
	'backend.imagecopyresampled_failed': 'The image processing unit failed: GD imagecopyresampled() failed.',
	'backend.imagecopy_failed': 'The image processing unit failed: GD imagecopy() failed.',
	'backend.imageflip_failed': 'The image processing unit failed: cannot flip the image.',
	'backend.imagejpeg_failed': 'The image processing unit failed: GD imagejpeg() failed.',
	'backend.imagepng_failed': 'The image processing unit failed: GD imagepng() failed.',
	'backend.imagegif_failed': 'The image processing unit failed: GD imagegif() failed.',
	'backend.imagecreate_failed': 'The image processing unit failed: GD imagecreate() failed.',
	'backend.cvt2truecolor_failed': 'conversion to True Color failed. Image resolution: ', /* x * y */
	'backend.no_imageinfo': 'Corrupt image or not an image file at all.',
	'backend.img_will_not_fit': 'image does not fit in available RAM; minimum required (estimate): ', /* XXX MBytes */
	'backend.unsupported_imgfmt': 'unsupported image format: ',    /* jpeg/png/gif/... */

	/* FU */
	uploader: {
		unknown: 'Onbekende fout',
		sizeLimitMin: 'Je kan het bestand "<em>${name}</em>" (${size}) niet toevoegen, de minimum bestandsgrootte voor upload is <strong>${size_min}</strong>!',
		sizeLimitMax: 'Je kan het bestand "<em>${name}</em>" (${size}) niet toevoegen, de minimum bestandsgrootte voor upload is <strong>${size_max}</strong>!'
	},

	flash: {
		hidden: 'Om de ingebouwde uploader in te schakelen, deblokkeer deze in je browser en vernieuw de pagina (zie Adblock).',
		disabled: 'Om de ingebouwde uploader in te schakelen, schakel het geblokkeerde Flash-component in en vernieuw de pagina (zie Flashblock).',
		flash: 'Om bestanden te kunnen uploaden dien je <a href="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash">Adobe Flash</a> te installeren.'
	},

	resizeImages: 'Pas de dimensies van grote afbeeldingen aan'
};