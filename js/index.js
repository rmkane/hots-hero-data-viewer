const heroData = new HeroData('Cassia', {
  callback: onLoad
});

const templates = {
  view: null
};

const levels = [1, 4, 7, 10, 13, 16, 20];
Handlebars.registerHelper('format_level', tier => levels[tier - 1]);

// Should finish loading before onLoad is called.
loadTemplate('templates/view.hjs')
  .then(template => {
    templates.view = template;
  });

function onLoad(hero) {
  renderView(hero);
}

function renderView(viewModel) {
  document.getElementById('target').innerHTML = templates.view(viewModel);
}

function loadTemplate(filename) {
  return fetch(filename)
    .then((response) => response.text())
    .then((template) => Handlebars.compile(template));
}