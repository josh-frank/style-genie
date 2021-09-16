const joinRules = ( rule, completeStyle, selector ) => completeStyle[ selector ] = ( completeStyle[ selector ] || "" ) + rule.declarations.reduce( ( completeRule, { property, value } ) => property && value ? [ ...completeRule, `${ property }: ${ value };` ] : completeRule, [] ).join( " " );

const addBlockToObject = ( selector, stylesObject, blockToAdd ) => stylesObject[ selector ] = ( stylesObject[ selector ] || "" ) + blockToAdd;

const mergeWithMatchingSelectors = ( stylesObject, selector ) => {
    for ( let otherSelector of Object.keys( stylesObject ).filter( otherSelector => otherSelector !== selector ) ) {
        if ( otherSelector.match( `${ selector }[.#:\[\\s]+` ) ) {
            addBlockToObject( selector, stylesObject, ` ${ otherSelector.replace( selector, "&" ) } { ${ stylesObject[ otherSelector ] } }` );
            delete stylesObject[ otherSelector ];
        }
    }
};

exports.parse = css => {
    const parsedCss = require( "css" ).parse( css );
    const mediaRules = parsedCss.stylesheet.rules.filter( rule => rule.media );
    const stylesObject = parsedCss.stylesheet.rules.reduce( ( completeStyle, rule ) => {
        rule.selectors?.forEach( selector => joinRules( rule, completeStyle, selector ) );
        return completeStyle;
    }, {} );
    mediaRules.forEach( rule => {
        const mediaObject = rule.rules.reduce( ( completeMediaRule, mediaRule ) => {
            mediaRule.selectors?.forEach( selector => joinRules( mediaRule, completeMediaRule, selector ) );
            return completeMediaRule;
        }, {} );
        Object.keys( mediaObject ).forEach( mediaSelector => {
            mergeWithMatchingSelectors( { ...mediaObject }, mediaSelector );
            addBlockToObject( mediaSelector, stylesObject, ` @media ${ rule.media } { ${ mediaObject[ mediaSelector ] } }` )
        } );
    } );
    Object.keys( stylesObject ).forEach( selector => mergeWithMatchingSelectors( stylesObject, selector ) );
    return stylesObject;
};
