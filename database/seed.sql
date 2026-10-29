
USE conectadoa;

INSERT INTO doador (nome, email, telefone) VALUES
('Ana Silva', 'ana.teste@example.com', '14999990001'),
('Carlos Souza', 'carlos.teste@example.com', '14999990002');

INSERT INTO categoria (nome) VALUES
('Alimentos'),
('Roupas'),
('Higiene');

INSERT INTO item (id_categoria, nome, unidade) VALUES
(1, 'Arroz 5 kg', 'pacote'),
(1, 'Feijão 1 kg', 'pacote'),
(2, 'Camiseta', 'peça'),
(3, 'Sabonete', 'unidade');

INSERT INTO doacao (id_doador, data_doacao, observacao) VALUES
(1, '2026-10-28', 'Doação de alimentos'),
(2, '2026-10-28', 'Doação de roupas e higiene');

INSERT INTO doacao_item (id_doacao, id_item, quantidade) VALUES
(1, 1, 2),
(1, 2, 5),
(2, 3, 3),
(2, 4, 10);
