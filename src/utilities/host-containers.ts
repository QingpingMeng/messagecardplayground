/* tslint:disable */

import { MessageCard } from "./message-card";
import * as Adaptive from "adaptivecards";

export abstract class HostContainer {
    readonly name: string;
    readonly styleSheetName: string;

    constructor(name: string, styleSheetName: string) {
        this.name = name;
        this.styleSheetName = styleSheetName;
    }

    cardConfiguration: Adaptive.HostConfig;
    allowCardTitle: boolean = true;
    allowFacts: boolean = true;
    allowHeroImage: boolean = true;
    allowImages: boolean = true;
    allowActionCard: boolean = true;

    abstract render(card: MessageCard): HTMLElement;
}

export class DesktopHostContainer extends HostContainer {
    render(card: MessageCard): HTMLElement {
        var element = document.createElement("div");

        switch (card.style) {
            case "compact":
                element.style.borderLeft = "5px solid #A6A6A6";

                break;
            default:
                element.style.border = "1px solid #EEEEEE";
                
                if (card.themeColor) {
                    element.style.borderLeft = "3px solid #" + card.themeColor;
                }
                
                break;
        }

        element.appendChild(card.render());

        return element;
    }
}

export var hostContainers: Array<HostContainer> = [];

export const defaultCardConfig: Adaptive.HostConfig = new Adaptive.HostConfig({
    spacing: {
        small: 10,
        default: 20,
        medium: 30,
        large: 40,
        extraLarge: 50,
        padding: 20
    },
    separator: {
        lineThickness: 1,
        lineColor: "#EEEEEE"
    },
    supportsInteractivity: true,
    fontFamily: "Segoe UI",
    fontSizes: {
        small: 12,
        default: 14,
        medium: 17,
        large: 21,
        extraLarge: 26
    },
    fontWeights: {
        lighter: 200,
        default: 400,
        bolder: 600
    },
    containerStyles: {
        default: {
            backgroundColor: "#FFFFFF",
            foregroundColors: {
                default: {
                    default: "#333333",
                    subtle: "#EE333333"
                },
                accent: {
                    default: "#2E89FC",
                    subtle: "#882E89FC"
                },
                attention: {
                    default: "#cc3300",
                    subtle: "#DDcc3300"
                },
                good: {
                    default: "#54a254",
                    subtle: "#DD54a254"
                },
                warning: {
                    default: "#e69500",
                    subtle: "#DDe69500"
                }
            }
        },
        emphasis: {
            backgroundColor: "#08000000",
            foregroundColors: {
                default: {
                    default: "#333333",
                    subtle: "#EE333333"
                },
                accent: {
                    default: "#2E89FC",
                    subtle: "#882E89FC"
                },
                attention: {
                    default: "#cc3300",
                    subtle: "#DDcc3300"
                },
                good: {
                    default: "#54a254",
                    subtle: "#DD54a254"
                },
                warning: {
                    default: "#e69500",
                    subtle: "#DDe69500"
                }
            }
        }
    },
    imageSizes: {
        small: 40,
        medium: 80,
        large: 160
    },
    actions: {
        maxActions: 5,
        spacing: Adaptive.Spacing.Default,
        buttonSpacing: 10,
        showCard: {
            actionMode: Adaptive.ShowCardActionMode.Inline,
            inlineTopMargin: 16
        },
        actionsOrientation: Adaptive.Orientation.Horizontal,
        actionAlignment: Adaptive.ActionAlignment.Left
    },
    adaptiveCard: {
        allowCustomStyle: false
    },
    imageSet: {
        imageSize: Adaptive.Size.Medium,
        maxImageHeight: 100
    },
    factSet: {
        title: {
            color: Adaptive.TextColor.Default,
            size: Adaptive.TextSize.Default,
            isSubtle: false,
            weight: Adaptive.TextWeight.Bolder,
            wrap: true,
            maxWidth: 150,
        },
        value: {
            color: Adaptive.TextColor.Default,
            size: Adaptive.TextSize.Default,
            isSubtle: false,
            weight: Adaptive.TextWeight.Default,
            wrap: true,
        },
        spacing: 10
    }
});

export const compactCardConfig: Adaptive.HostConfig = new Adaptive.HostConfig({
    spacing: {
        small: 10,
        default: 12,
        medium: 14,
        large: 16,
        extraLarge: 18,
        padding: 8
    },
    separator: {
        lineThickness: 1,
        lineColor: "#19000000"
    },
    supportsInteractivity: true,
    fontFamily: "wf_segoe-ui_normal",
    fontSizes: {
        small: 10,
        default: 12,
        medium: 14,
        large: 16,
        extraLarge: 18
    },
    fontWeights: {
        lighter: 200,
        default: 400,
        bolder: 600
    },
    containerStyles: {
        default: {
            backgroundColor: "#EAEAEA",
            foregroundColors: {
                default: {
                    default: "#333333",
                    subtle: "#EE333333"
                },
                accent: {
                    default: "#2E89FC",
                    subtle: "#882E89FC" 
                },
                attention: {
                    default: "#FFD800",
                    subtle: "#DDFFD800"
                },
                good: {
                    default: "#00FF00",
                    subtle: "#DD00FF00"
                },
                warning: {
                    default: "#FF0000",
                    subtle: "#DDFF0000"
                }
            }
        },
        emphasis: {
            backgroundColor: "#E0E0E0",
            foregroundColors: {
                default: {
                    default: "#333333",
                    subtle: "#EE333333"
                },
                accent: {
                    default: "#2E89FC",
                    subtle: "#882E89FC" 
                },
                attention: {
                    normal: "#FFD800",
                    subtle: "#DDFFD800"
                },
                good: {
                    default: "#00FF00",
                    subtle: "#DD00FF00"
                },
                warning: {
                    default: "#FF0000",
                    subtle: "#DDFF0000"
                }
            }
        }
    },
    imageSizes: {
        small: 16,
        medium: 32,
        large: 64
    },
    actions: {
        maxActions: 5,
        spacing: Adaptive.Spacing.Default,
        buttonSpacing: 20,
        showCard: {
            actionMode: Adaptive.ShowCardActionMode.Inline,
            inlineTopMargin: 10
        },
        actionsOrientation: Adaptive.Orientation.Horizontal,
        actionAlignment: Adaptive.ActionAlignment.Left
    },
    adaptiveCard: {
        allowCustomStyle: false
    },
    imageSet: {
        imageSize: Adaptive.Size.Medium,
        maxImageHeight: 100
    },
    factSet: {
        title: {
            color: Adaptive.TextColor.Default,
            size: Adaptive.TextSize.Default,
            isSubtle: false,
            weight: Adaptive.TextWeight.Bolder,
            wrap: true,
            maxWidth: 150,
        },
        value: {
            color: Adaptive.TextColor.Default,
            size: Adaptive.TextSize.Default,
            isSubtle: false,
            weight: Adaptive.TextWeight.Default,
            wrap: true,
        },
        spacing: 10
    }
});

export function initializeHostContainers() {
    var hostContainer = new DesktopHostContainer("default", "adaptivecard-default");
    hostContainer.cardConfiguration = defaultCardConfig;
    hostContainers.push(hostContainer);

    hostContainer = new DesktopHostContainer("compact", "adaptivecard-compact");
    hostContainer.cardConfiguration = compactCardConfig;
    // hostContainer.allowActionCard = false;
    hostContainer.allowCardTitle = false;
    hostContainer.allowFacts = false;
    hostContainer.allowHeroImage = false;
    hostContainer.allowImages = false;

    hostContainers.push(hostContainer);    
}

export function getHostContainerByName(name: string): HostContainer | null {
    for (var i = 0; i < hostContainers.length; i++) {
        if (hostContainers[i].name == name) {
            return hostContainers[i];
        }
    }

    return null;
}