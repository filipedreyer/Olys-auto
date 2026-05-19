const asset = (path: string) => new URL(path, import.meta.url).href;

export const olysAssets = {
  logo: {
    primary: asset("./logo/olys_logo_primary.svg"),
    negative: asset("./logo/olys_logo_negative.svg"),
    whiteOnTeal: asset("./logo/olys_logo_white_on_teal.svg"),
    symbolTeal: asset("./logo/olys_symbol_teal.svg"),
    symbolLightTeal: asset("./logo/olys_symbol_light_teal.svg"),
  },
  nav: {
    fazer: asset("./icons/icon-nav-fazer.svg"),
    planejar: asset("./icons/icon-nav-planejar.svg"),
    memoria: asset("./icons/icon-nav-memoria.svg"),
    capturar: asset("./icons/icon-nav-capturar.svg"),
    idea: asset("./icons/icon-nav-idea.svg"),
    inbox: asset("./icons/icon-nav-inbox.svg"),
    acesso: asset("./icons/icon-nav-acesso.svg"),
    hoje: asset("./icons/icon-nav-hoje.svg"),
    timeline: asset("./icons/icon-nav-timeline.svg"),
  },
  floatingActionPair: {
    default: asset("./icons/floating_action_pair_52px_default.svg"),
    capturarPressed: asset("./icons/floating_action_pair_52px_capturar_pressed.svg"),
    ideaPressed: asset("./icons/floating_action_pair_52px_idea_pressed.svg"),
    ideaRelevant: asset("./icons/floating_action_pair_52px_idea_relevant.svg"),
  },
  rails: {
    row: {
      agenda: asset("./rails/row_entity_rail_4x34_agenda.svg"),
      event: asset("./rails/row_entity_rail_4x34_evento.svg"),
      habit: asset("./rails/row_entity_rail_4x34_habito.svg"),
      reminder: asset("./rails/row_entity_rail_4x34_lembrete.svg"),
      list: asset("./rails/row_entity_rail_4x34_lista.svg"),
      goal: asset("./rails/row_entity_rail_4x34_meta.svg"),
      note: asset("./rails/row_entity_rail_4x34_nota.svg"),
      project: asset("./rails/row_entity_rail_4x34_projeto.svg"),
      routine: asset("./rails/row_entity_rail_4x34_rotina.svg"),
      task: asset("./rails/row_entity_rail_4x34_tarefa.svg"),
      unclassified: asset("./rails/row_rail_unclassified_4x34.svg"),
    },
    card: {
      agenda: asset("./rails/card_entity_rail_4x108_agenda.svg"),
      event: asset("./rails/card_entity_rail_4x108_evento.svg"),
      habit: asset("./rails/card_entity_rail_4x108_habito.svg"),
      reminder: asset("./rails/card_entity_rail_4x108_lembrete.svg"),
      list: asset("./rails/card_entity_rail_4x108_lista.svg"),
      goal: asset("./rails/card_entity_rail_4x108_meta.svg"),
      note: asset("./rails/card_entity_rail_4x108_nota.svg"),
      routine: asset("./rails/card_entity_rail_4x108_rotina.svg"),
      task: asset("./rails/card_entity_rail_4x108_tarefa.svg"),
      unclassified: asset("./rails/card_rail_unclassified_4x108.svg"),
    },
  },
  indicators: {
    capacity: asset("./indicators/capacity_normal.svg"),
    direction: asset("./indicators/direction_normal.svg"),
    pair: asset("./indicators/pair_normal.svg"),
    tabs: {
      hojeActive: asset("./indicators/tabs_hoje_active.svg"),
      hojeFocusVisible: asset("./indicators/tabs_hoje_focus_visible.svg"),
      timelineActive: asset("./indicators/tabs_timeline_active.svg"),
      timelineFocusVisible: asset("./indicators/tabs_timeline_focus_visible.svg"),
    },
    checkbox: {
      checked: asset("./indicators/checkbox_square_checked.svg"),
      disabled: asset("./indicators/checkbox_square_disabled.svg"),
      focusVisible: asset("./indicators/checkbox_square_focus_visible.svg"),
    },
    chips: {
      essentialNow: asset("./indicators/chip_essencial_agora.svg"),
      dependency: asset("./indicators/chip_dependencia.svg"),
    },
    unknown: asset("./indicators/icon-state-vazio.png"),
  },
} as const;

export type OlysAssetManifest = typeof olysAssets;
