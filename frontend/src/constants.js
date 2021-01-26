export const KEYS = [
    {"id" : 0,  "name" 	: "C"},
    {"id" : 1,  "name" 	: "C#"},
    {"id" : 2,  "name" 	: "D"},
    {"id" : 3,  "name" 	: "D#"},
    {"id" : 4,  "name" 	: "E"},
    {"id" : 5,  "name" 	: "F"},
    {"id" : 6,  "name" 	: "F#"},
    {"id" : 7,  "name" 	: "G"},
    {"id" : 8,  "name" 	: "G#"},
    {"id" : 9, "name" 	: "A"},
    {"id" : 10, "name" 	: "B"},    
]

export function encodeMusicKey(key_number) {
	return KEYS.filter(key => { return key.id === key_number })[0].name;
}

export function formatDatetime(iso_str) {
    const monthNames = [
        "stycznia",
        "lutego",
        "marca",
        "kwietnia",
        "maja",
        "czerwca",
        "lipca",
        "sierpnia",
        "września",
        "października",
        "listopada",
        "grudnia"
    ];
    var datetime = new Date(iso_str);
    return datetime.getDay() + ' ' + monthNames[datetime.getMonth()] + ' ' + datetime.getFullYear();
}