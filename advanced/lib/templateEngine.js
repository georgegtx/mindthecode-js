import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getTemplate = (view) => {
    return fs.readFileSync(__dirname  + `/../templates/${view}.html`, {encoding:'utf8', flag:'r'})
}

const interpolateLoops = (template, context, model) => {
    
    const regexp = /{{#for\s*(\S*)\s*of\s*(\S*)\s*(<.*>)\s*}}/g
    
    let match = regexp.exec(template);
    
    while (match != null) {
        
        var elKey = match[1]
        var param = match[2]
        var templateEl = match[3]

        const results = []
        
        if (param.startsWith('$') && Array.isArray(context[param])) {

            context[param].forEach(el => {
                results.push(templateEl.replace(`{{${elKey}}}`, el))
            })

        } else if (param.startsWith('model.') && Array.isArray(model[param.replace('model.','')])) {
            
            model[param.replace('model.','')].forEach(el => {
                results.push(templateEl.replace(`{{${elKey}}}`, el))
            })
        }

        template = template.replace(match[0], results.join('\r\n'))

        match = regexp.exec(template);
    }

    return template
}

const interpolateInline = (template, context, model) => {

    const matches = template.matchAll(new RegExp('{{(.+)}}','g'))
    
    for (const match of matches) {
        
        var param = match[1]

        if (param.startsWith('$')) {
            template = template.replace(`{{${param}}}`, context[param])
        } else if (param.startsWith('model.')) {
            template = template.replace(`{{${param}}}`, model[param.replace('model.','')])
        } else if (param.startsWith('%')) {
            template = template.replace(`{{${param}}}`, page(param.replace('%',''), model))
        }
    }
    
    return template
}

const page = (view, model) => {
    
    const context = {
        '$date': new Date().toLocaleTimeString()
    }
    
    let template = getTemplate(view)
    
    template = interpolateInline(template, context, model)

    template = interpolateLoops(template, context, model)

    return template
}

export {
    page
}