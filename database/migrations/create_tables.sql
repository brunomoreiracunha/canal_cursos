-- Tabela de Categoria
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icon VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Tabela de Cursos
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INT,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    instructor VARCHAR(255),
    duration VARCHAR(255) NOT NULL,
    level VARCHAR(50),
    rating DECIMAL(3, 2) NOT NULL,
    link_venda VARCHAR(255) NOT NULL,
    featured INT DEFAULT 0,
    formatted_description LONGTEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabela de Mídias dos Cursos
CREATE TABLE course_media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    type ENUM('image', 'video') NOT NULL,
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Tabela de Objetivos de Aprendizado dos Cursos
CREATE TABLE course_learning_objectives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    title VARCHAR(255) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Tabela de Itens de Objetivos de Aprendizado dos Cursos
CREATE TABLE course_learning_objective_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_learning_objective_id INT,
    item TEXT NOT NULL,
    FOREIGN KEY (course_learning_objective_id) REFERENCES course_learning_objectives(id)
);

-- Tabela de Usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo TINYINT(1) DEFAULT 0
);

-- Tabela de Favoritos dos Cursos (Relacionamento entre Usuários e Cursos)
CREATE TABLE favorites (
    user_id INT,
    course_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);


/*
-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_learning_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_learning_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = user_id
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories are editable by admins"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Policies for courses
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Courses are editable by admins"
  ON courses FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Policies for course media
CREATE POLICY "Course media is viewable by everyone"
  ON course_media FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Course media is editable by admins"
  ON course_media FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Policies for learning objectives
CREATE POLICY "Learning objectives are viewable by everyone"
  ON course_learning_objectives FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Learning objectives are editable by admins"
  ON course_learning_objectives FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Policies for learning items
CREATE POLICY "Learning items are viewable by everyone"
  ON course_learning_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Learning items are editable by admins"
  ON course_learning_items FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
CcREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_media_updated_at
  BEFORE UPDATE ON course_media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_learning_objectives_updated_at
  BEFORE UPDATE ON course_learning_objectives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_learning_items_updated_at
  BEFORE UPDATE ON course_learning_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();