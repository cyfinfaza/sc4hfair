export function canWebShare() {
	if(navigator.share){
		return true;
	} else {
		return false;
	}
}

export function share(title, url){
	if(navigator.share){
		navigator.share({title, url}).catch(()=>console.error("Share failed"))
	} else {
		console.error("navigator.share unavailable")
	}
}