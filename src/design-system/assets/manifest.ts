const assetRoot = "/src/design-system/assets";

export const olysAssets = {
  logo: {
    primary: `${assetRoot}/logo/olys_logo_primary.svg`,
    negative: `${assetRoot}/logo/olys_logo_negative.svg`,
    whiteOnTeal: `${assetRoot}/logo/olys_logo_white_on_teal.svg`,
    symbolTeal: `${assetRoot}/logo/olys_symbol_teal.svg`,
    symbolLightTeal: `${assetRoot}/logo/olys_symbol_light_teal.svg`,
  },
  nav: {
    fazer: `${assetRoot}/icons/icon-nav-fazer.svg`,
    planejar: `${assetRoot}/icons/icon-nav-planejar.svg`,
    memoria: `${assetRoot}/icons/icon-nav-memoria.svg`,
    capturar: `${assetRoot}/icons/icon-nav-capturar.svg`,
    idea: `${assetRoot}/icons/icon-nav-idea.svg`,
    inbox: `${assetRoot}/icons/icon-nav-inbox.svg`,
    acesso: `${assetRoot}/icons/icon-nav-acesso.svg`,
    hoje: `${assetRoot}/icons/icon-nav-hoje.svg`,
    timeline: `${assetRoot}/icons/icon-nav-timeline.svg`,
  },
  floatingActionPair: {
    default: `${assetRoot}/icons/floating_action_pair_52px_default.svg`,
    capturarPressed: `${assetRoot}/icons/floating_action_pair_52px_capturar_pressed.svg`,
    ideaPressed: `${assetRoot}/icons/floating_action_pair_52px_idea_pressed.svg`,
    ideaRelevant: `${assetRoot}/icons/floating_action_pair_52px_idea_relevant.svg`,
  },
  rails: {
    row: {
      agenda: `${assetRoot}/rails/row_entity_rail_4x34_agenda.svg`,
      event: `${assetRoot}/rails/row_entity_rail_4x34_evento.svg`,
      habit: `${assetRoot}/rails/row_entity_rail_4x34_habito.svg`,
      reminder: `${assetRoot}/rails/row_entity_rail_4x34_lembrete.svg`,
      list: `${assetRoot}/rails/row_entity_rail_4x34_lista.svg`,
      goal: `${assetRoot}/rails/row_entity_rail_4x34_meta.svg`,
      note: `${assetRoot}/rails/row_entity_rail_4x34_nota.svg`,
      project: `${assetRoot}/rails/row_entity_rail_4x34_projeto.svg`,
      routine: `${assetRoot}/rails/row_entity_rail_4x34_rotina.svg`,
      task: `${assetRoot}/rails/row_entity_rail_4x34_tarefa.svg`,
      unclassified: `${assetRoot}/rails/row_rail_unclassified_4x34.svg`,
    },
    card: {
      agenda: `${assetRoot}/rails/card_entity_rail_4x108_agenda.svg`,
      event: `${assetRoot}/rails/card_entity_rail_4x108_evento.svg`,
      habit: `${assetRoot}/rails/card_entity_rail_4x108_habito.svg`,
      reminder: `${assetRoot}/rails/card_entity_rail_4x108_lembrete.svg`,
      list: `${assetRoot}/rails/card_entity_rail_4x108_lista.svg`,
      goal: `${assetRoot}/rails/card_entity_rail_4x108_meta.svg`,
      note: `${assetRoot}/rails/card_entity_rail_4x108_nota.svg`,
      routine: `${assetRoot}/rails/card_entity_rail_4x108_rotina.svg`,
      task: `${assetRoot}/rails/card_entity_rail_4x108_tarefa.svg`,
      unclassified: `${assetRoot}/rails/card_rail_unclassified_4x108.svg`,
    },
  },
  indicators: {
    capacity: `${assetRoot}/indicators/capacity_normal.svg`,
    direction: `${assetRoot}/indicators/direction_normal.svg`,
    pair: `${assetRoot}/indicators/pair_normal.svg`,
    tabs: {
      hojeActive: `${assetRoot}/indicators/tabs_hoje_active.svg`,
      hojeFocusVisible: `${assetRoot}/indicators/tabs_hoje_focus_visible.svg`,
      timelineActive: `${assetRoot}/indicators/tabs_timeline_active.svg`,
      timelineFocusVisible: `${assetRoot}/indicators/tabs_timeline_focus_visible.svg`,
    },
    checkbox: {
      checked: `${assetRoot}/indicators/checkbox_square_checked.svg`,
      disabled: `${assetRoot}/indicators/checkbox_square_disabled.svg`,
      focusVisible: `${assetRoot}/indicators/checkbox_square_focus_visible.svg`,
    },
    chips: {
      essentialNow: `${assetRoot}/indicators/chip_essencial_agora.svg`,
      dependency: `${assetRoot}/indicators/chip_dependencia.svg`,
    },
    unknown: `${assetRoot}/indicators/icon-state-vazio.png`,
  },
} as const;

export type OlysAssetManifest = typeof olysAssets;
