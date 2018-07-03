/* tslint:disable */
import * as Adaptive from 'adaptivecards';

export class Theme {
    readonly name: string;
    readonly styleSheetName: string;
    readonly hostConfig: Adaptive.HostConfig;

    constructor(
        name: string,
        styleSheetName: string,
        hostConfig: Adaptive.HostConfig
    ) {
        this.name = name;
        this.styleSheetName = styleSheetName;
        this.hostConfig = hostConfig;
    }

    allowCardTitle: boolean = true;
    allowFacts: boolean = true;
    allowHeroImage: boolean = true;
    allowImages: boolean = true;
    allowActionCard: boolean = true;
}

export var themes: Array<Theme> = [];
export var defaultTheme: Theme;

export function setTheme(themeName: string) {
    let themeLink = document.getElementById('theme-link') as HTMLLinkElement;
    if (themeLink) {
        themeLink.href = `./themes/${themeName}.css`;
    } else {
        themeLink = document.createElement('link');
        themeLink.href = `./themes/${themeName}.css`;
        themeLink.rel = 'stylesheet';
        themeLink.id = 'theme-link';
        document.head.appendChild(themeLink);
    }
}

export function initializeThemes() {
    defaultTheme = new Theme(
        'default',
        'adaptivecard-default',
        new Adaptive.HostConfig({
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
                lineColor: '#EEEEEE'
            },
            supportsInteractivity: true,
            fontFamily: 'Segoe UI',
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
                    backgroundColor: '#FFFFFF',
                    foregroundColors: {
                        default: {
                            default: '#333333',
                            subtle: '#EE333333'
                        },
                        dark: {
                            default: '#000000',
                            subtle: '#66000000'
                        },
                        light: {
                            default: '#FFFFFF',
                            subtle: '#33000000'
                        },
                        accent: {
                            default: '#2E89FC',
                            subtle: '#882E89FC'
                        },
                        attention: {
                            default: '#cc3300',
                            subtle: '#DDcc3300'
                        },
                        good: {
                            default: '#54a254',
                            subtle: '#DD54a254'
                        },
                        warning: {
                            default: '#e69500',
                            subtle: '#DDe69500'
                        }
                    }
                },
                emphasis: {
                    backgroundColor: '#08000000',
                    foregroundColors: {
                        default: {
                            normal: '#333333',
                            subtle: '#EE333333'
                        },
                        dark: {
                            default: '#000000',
                            subtle: '#66000000'
                        },
                        light: {
                            default: '#FFFFFF',
                            subtle: '#33000000'
                        },
                        accent: {
                            normal: '#2E89FC',
                            subtle: '#882E89FC'
                        },
                        attention: {
                            normal: '#cc3300',
                            subtle: '#DDcc3300'
                        },
                        good: {
                            normal: '#54a254',
                            subtle: '#DD54a254'
                        },
                        warning: {
                            normal: '#e69500',
                            subtle: '#DDe69500'
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
                preExpandSingleShowCardAction: true,
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
                allowCustomStyle: true
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
                    maxWidth: 150
                },
                value: {
                    color: Adaptive.TextColor.Default,
                    size: Adaptive.TextSize.Default,
                    isSubtle: false,
                    weight: Adaptive.TextWeight.Default,
                    wrap: true
                },
                spacing: 10
            }
        })
    );

    themes.push(defaultTheme);

    let theme = new Theme(
        'compact',
        'adaptivecard-compact',
        new Adaptive.HostConfig({
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
                lineColor: '#19000000'
            },
            supportsInteractivity: true,
            fontFamily: 'wf_segoe-ui_normal',
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
                    backgroundColor: '#EAEAEA',
                    foregroundColors: {
                        default: {
                            default: '#333333',
                            subtle: '#EE333333'
                        },
                        dark: {
                            default: '#000000',
                            subtle: '#66000000'
                        },
                        light: {
                            default: '#FFFFFF',
                            subtle: '#33000000'
                        },
                        accent: {
                            default: '#2E89FC',
                            subtle: '#882E89FC'
                        },
                        attention: {
                            default: '#FFD800',
                            subtle: '#DDFFD800'
                        },
                        good: {
                            default: '#00FF00',
                            subtle: '#DD00FF00'
                        },
                        warning: {
                            default: '#FF0000',
                            subtle: '#DDFF0000'
                        }
                    }
                },
                emphasis: {
                    backgroundColor: '#E0E0E0',
                    foregroundColors: {
                        default: {
                            default: '#333333',
                            subtle: '#EE333333'
                        },
                        dark: {
                            default: '#000000',
                            subtle: '#66000000'
                        },
                        light: {
                            default: '#FFFFFF',
                            subtle: '#33000000'
                        },
                        accent: {
                            default: '#2E89FC',
                            subtle: '#882E89FC'
                        },
                        attention: {
                            default: '#FFD800',
                            subtle: '#DDFFD800'
                        },
                        good: {
                            default: '#00FF00',
                            subtle: '#DD00FF00'
                        },
                        warning: {
                            default: '#FF0000',
                            subtle: '#DDFF0000'
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
                preExpandSingleShowCardAction: true,
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
                allowCustomStyle: true
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
                    maxWidth: 150
                },
                value: {
                    color: Adaptive.TextColor.Default,
                    size: Adaptive.TextSize.Default,
                    isSubtle: false,
                    weight: Adaptive.TextWeight.Default,
                    wrap: true
                },
                spacing: 10
            }
        })
    );
    // theme.allowActionCard = false;
    theme.allowCardTitle = false;
    theme.allowFacts = false;
    theme.allowHeroImage = false;
    theme.allowImages = false;

    themes.push(theme);

    theme = new Theme(
        'infobar-generic',
        'adaptivecard-infobar-generic',
        new Adaptive.HostConfig({
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
                lineColor: '#19000000'
            },
            supportsInteractivity: true,
            fontFamily: 'Segoe UI',
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
                    backgroundColor: '#FFFFFF',
                    foregroundColors: {
                        default: {
                            default: '#333333',
                            subtle: '#EE333333'
                        },
                        dark: {
                            default: '#000000',
                            subtle: '#66000000'
                        },
                        light: {
                            default: '#FFFFFF',
                            subtle: '#33000000'
                        },
                        accent: {
                            default: '#2E89FC',
                            subtle: '#882E89FC'
                        },
                        attention: {
                            default: '#FFD800',
                            subtle: '#DDFFD800'
                        },
                        good: {
                            default: '#00FF00',
                            subtle: '#DD00FF00'
                        },
                        warning: {
                            default: '#FF0000',
                            subtle: '#DDFF0000'
                        }
                    }
                },
                emphasis: {
                    backgroundColor: '#FFFFFF',
                    foregroundColors: {
                        default: {
                            default: '#333333',
                            subtle: '#EE333333'
                        },
                        dark: {
                            default: '#000000',
                            subtle: '#66000000'
                        },
                        light: {
                            default: '#FFFFFF',
                            subtle: '#33000000'
                        },
                        accent: {
                            default: '#2E89FC',
                            subtle: '#882E89FC'
                        },
                        attention: {
                            default: '#FFD800',
                            subtle: '#DDFFD800'
                        },
                        good: {
                            default: '#00FF00',
                            subtle: '#DD00FF00'
                        },
                        warning: {
                            default: '#FF0000',
                            subtle: '#DDFF0000'
                        }
                    }
                },
                customStyles: [
                    {
                        name: 'infobar-buttonarea',
                        style: {
                            backgroundColor: '#F8F8F8',
                            foregroundColors: {
                                default: {
                                    default: '#333333',
                                    subtle: '#EE333333'
                                },
                                dark: {
                                    default: '#000000',
                                    subtle: '#66000000'
                                },
                                light: {
                                    default: '#FFFFFF',
                                    subtle: '#33000000'
                                },
                                accent: {
                                    default: '#2E89FC',
                                    subtle: '#882E89FC'
                                },
                                attention: {
                                    default: '#FFD800',
                                    subtle: '#DDFFD800'
                                },
                                good: {
                                    default: '#00FF00',
                                    subtle: '#DD00FF00'
                                },
                                warning: {
                                    default: '#FF0000',
                                    subtle: '#DDFF0000'
                                }
                            }
                        }
                    }
                ]
            },
            imageSizes: {
                small: 16,
                medium: 32,
                large: 64
            },
            actions: {
                preExpandSingleShowCardAction: true,
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
                allowCustomStyle: true
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
                    maxWidth: 150
                },
                value: {
                    color: Adaptive.TextColor.Default,
                    size: Adaptive.TextSize.Default,
                    isSubtle: false,
                    weight: Adaptive.TextWeight.Default,
                    wrap: true
                },
                spacing: 10
            }
        })
    );

    themes.push(theme);

    theme = new Theme(
        'infobar-alert',
        'adaptivecard-infobar-alert',
        new Adaptive.HostConfig({
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
                lineColor: '#FFF1F0'
            },
            supportsInteractivity: true,
            fontFamily: 'Segoe UI',
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
                    backgroundColor: '#FFF9F8',
                    foregroundColors: {
                        default: {
                            default: '#333333',
                            subtle: '#EE333333'
                        },
                        dark: {
                            default: '#000000',
                            subtle: '#66000000'
                        },
                        light: {
                            default: '#FFFFFF',
                            subtle: '#33000000'
                        },
                        accent: {
                            default: '#2E89FC',
                            subtle: '#882E89FC'
                        },
                        attention: {
                            default: '#FFD800',
                            subtle: '#DDFFD800'
                        },
                        good: {
                            default: '#00FF00',
                            subtle: '#DD00FF00'
                        },
                        warning: {
                            default: '#FF0000',
                            subtle: '#DDFF0000'
                        }
                    }
                },
                emphasis: {
                    backgroundColor: '#FFF1F0',
                    foregroundColors: {
                        default: {
                            normal: '#333333',
                            subtle: '#EE333333'
                        },
                        dark: {
                            default: '#000000',
                            subtle: '#66000000'
                        },
                        light: {
                            default: '#FFFFFF',
                            subtle: '#33000000'
                        },
                        accent: {
                            normal: '#2E89FC',
                            subtle: '#882E89FC'
                        },
                        attention: {
                            normal: '#FFD800',
                            subtle: '#DDFFD800'
                        },
                        good: {
                            normal: '#00FF00',
                            subtle: '#DD00FF00'
                        },
                        warning: {
                            normal: '#FF0000',
                            subtle: '#DDFF0000'
                        }
                    }
                },
                customStyles: [
                    {
                        name: 'infobar-buttonarea',
                        style: {
                            backgroundColor: '#FFF9F8',
                            foregroundColors: {
                                default: {
                                    default: '#333333',
                                    subtle: '#EE333333'
                                },
                                dark: {
                                    default: '#000000',
                                    subtle: '#66000000'
                                },
                                light: {
                                    default: '#FFFFFF',
                                    subtle: '#33000000'
                                },
                                accent: {
                                    default: '#2E89FC',
                                    subtle: '#882E89FC'
                                },
                                attention: {
                                    default: '#FFD800',
                                    subtle: '#DDFFD800'
                                },
                                good: {
                                    default: '#00FF00',
                                    subtle: '#DD00FF00'
                                },
                                warning: {
                                    default: '#FF0000',
                                    subtle: '#DDFF0000'
                                }
                            }
                        }
                    }
                ]
            },
            imageSizes: {
                small: 16,
                medium: 32,
                large: 64
            },
            actions: {
                preExpandSingleShowCardAction: true,
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
                allowCustomStyle: true
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
                    maxWidth: 150
                },
                value: {
                    color: Adaptive.TextColor.Default,
                    size: Adaptive.TextSize.Default,
                    isSubtle: false,
                    weight: Adaptive.TextWeight.Default,
                    wrap: true
                },
                spacing: 10
            }
        })
    );

    themes.push(theme);

    theme = new Theme(
        'txp-demo',
        'adaptivecard-txp-demo',
        new Adaptive.HostConfig({
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
                lineColor: '#EEEEEE'
            },
            supportsInteractivity: true,
            fontFamily: 'Segoe UI',
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
                    backgroundColor: '#FFFFFF',
                    foregroundColors: {
                        default: {
                            default: '#333333',
                            subtle: '#EE333333'
                        },
                        dark: {
                            default: '#000000',
                            subtle: '#66000000'
                        },
                        light: {
                            default: '#FFFFFF',
                            subtle: '#33000000'
                        },
                        accent: {
                            default: '#267EC5',
                            subtle: '#88267EC5'
                        },
                        attention: {
                            default: '#cc3300',
                            subtle: '#DDcc3300'
                        },
                        good: {
                            default: '#54a254',
                            subtle: '#DD54a254'
                        },
                        warning: {
                            default: '#e69500',
                            subtle: '#DDe69500'
                        }
                    }
                },
                emphasis: {
                    backgroundColor: '#08000000',
                    foregroundColors: {
                        default: {
                            normal: '#333333',
                            subtle: '#EE333333'
                        },
                        dark: {
                            default: '#000000',
                            subtle: '#66000000'
                        },
                        light: {
                            default: '#FFFFFF',
                            subtle: '#33000000'
                        },
                        accent: {
                            normal: '#267EC5',
                            subtle: '#88267EC5'
                        },
                        attention: {
                            normal: '#cc3300',
                            subtle: '#DDcc3300'
                        },
                        good: {
                            normal: '#54a254',
                            subtle: '#DD54a254'
                        },
                        warning: {
                            normal: '#e69500',
                            subtle: '#DDe69500'
                        }
                    }
                },
                customStyles: [
                    {
                        name: 'header',
                        style: {
                            backgroundColor: '#0078D7',
                            foregroundColors: {
                                default: {
                                    default: '#333333',
                                    subtle: '#EE333333'
                                },
                                dark: {
                                    default: '#000000',
                                    subtle: '#66000000'
                                },
                                light: {
                                    default: '#FFFFFF',
                                    subtle: '#33000000'
                                },
                                accent: {
                                    default: '#267EC5',
                                    subtle: '#88267EC5'
                                },
                                attention: {
                                    default: '#FFD800',
                                    subtle: '#DDFFD800'
                                },
                                good: {
                                    default: '#00FF00',
                                    subtle: '#DD00FF00'
                                },
                                warning: {
                                    default: '#FF0000',
                                    subtle: '#DDFF0000'
                                }
                            }
                        }
                    }
                ]
            },
            imageSizes: {
                small: 40,
                medium: 80,
                large: 160
            },
            actions: {
                preExpandSingleShowCardAction: true,
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
                allowCustomStyle: true
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
                    maxWidth: 150
                },
                value: {
                    color: Adaptive.TextColor.Default,
                    size: Adaptive.TextSize.Default,
                    isSubtle: false,
                    weight: Adaptive.TextWeight.Default,
                    wrap: true
                },
                spacing: 10
            }
        })
    );

    themes.push(theme);
}

export function getThemeByName(name: string): Theme {
    for (var i = 0; i < themes.length; i++) {
        if (themes[i].name == name) {
            return themes[i];
        }
    }

    return defaultTheme;
}
